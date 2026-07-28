---
tags:
  - Projet
  - Débutant
description: "Jeu 2D Java"
estimated_time: "35 min"
fiche_number: 2
total_fiches: 2
cursus: "Projets"
---

# 02 - Jeu 2D Java

> **En bref** : À la fin de cette fiche, tu sauras structurer un projet de jeu 2D en Java avec une architecture propre. Lecture estimée : 35 min.


## Prérequis

- [Fiches Java 01 à 10](../01-java/01-hello-world.md) (tout le cursus Java)
- Connaissances de base en programmation orientée objet

## Objectif de cette fiche

À la fin de cette fiche, tu sauras structurer un projet de jeu 2D en Java avec une architecture propre.

---

## Concepts

### Architecture d'un jeu

**Game Loop (Boucle de jeu)** :

```text
┌─────────────────────────────────────────────────┐
│                  Game Loop                       │
│                                                  │
│   ┌──────────┐    ┌──────────┐    ┌──────────┐  │
│   │  Input   │ →  │  Update  │ →  │  Render  │  │
│   │ (Entrée) │    │ (Logique)│    │(Affichage)│  │
│   └──────────┘    └──────────┘    └──────────┘  │
│        ↑                                   │     │
│        └───────────────────────────────────┘     │
└─────────────────────────────────────────────────┘
```

| Phase | Rôle |
| ----- | ---- |
| Input | Récupère les actions du joueur (clavier, souris) |
| Update | Met à jour l'état du jeu (positions, collisions) |
| Render | Affiche le jeu à l'écran |

---

### Structure de projet recommandée

```text
jeu2d/
├── src/
│   ├── Main.java
│   ├── engine/
│   │   ├── GameEngine.java
│   │   ├── GameLoop.java
│   │   └── InputHandler.java
│   ├── entities/
│   │   ├── Entity.java
│   │   ├── Player.java
│   │   └── Enemy.java
│   ├── graphics/
│   │   ├── Renderer.java
│   │   ├── Sprite.java
│   │   └── Animation.java
│   ├── states/
│   │   ├── GameState.java
│   │   ├── MenuState.java
│   │   └── PlayState.java
│   └── utils/
│       ├── Vector2D.java
│       └── Constants.java
└── resources/
    ├── images/
    └── sounds/
```

---

### Classes de base

**Entity (Entité)** :

```java
public abstract class Entity {
    protected double x;
    protected double y;
    protected double width;
    protected double height;
    protected double velocityX;
    protected double velocityY;

    public Entity(double x, double y, double width, double height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.velocityX = 0;
        this.velocityY = 0;
    }

    // Méthodes abstraites que chaque entité doit implémenter
    public abstract void update(double deltaTime);
    public abstract void render(Graphics2D g);

    // Détection de collision simple (rectangle)
    public boolean collidesWith(Entity other) {
        return x < other.x + other.width &&
               x + width > other.x &&
               y < other.y + other.height &&
               y + height > other.y;
    }

    // Getters et setters
    public double getX() { return x; }
    public double getY() { return y; }
    public void setPosition(double x, double y) {
        this.x = x;
        this.y = y;
    }
}
```

**Player (Joueur)** :

```java
public class Player extends Entity {
    private int health;
    private int score;
    private double speed;

    public Player(double x, double y) {
        super(x, y, 32, 32);  // 32x32 pixels
        this.health = 100;
        this.score = 0;
        this.speed = 200;  // pixels par seconde
    }

    @Override
    public void update(double deltaTime) {
        // Déplacement basé sur les touches pressées
        if (InputHandler.isKeyPressed(KeyEvent.VK_LEFT)) {
            x -= speed * deltaTime;
        }
        if (InputHandler.isKeyPressed(KeyEvent.VK_RIGHT)) {
            x += speed * deltaTime;
        }
        if (InputHandler.isKeyPressed(KeyEvent.VK_UP)) {
            y -= speed * deltaTime;
        }
        if (InputHandler.isKeyPressed(KeyEvent.VK_DOWN)) {
            y += speed * deltaTime;
        }
    }

    @Override
    public void render(Graphics2D g) {
        g.setColor(Color.BLUE);
        g.fillRect((int) x, (int) y, (int) width, (int) height);
    }

    public void takeDamage(int damage) {
        health -= damage;
        if (health <= 0) {
            health = 0;
            // Gérer la mort du joueur
        }
    }

    public void addScore(int points) {
        score += points;
    }

    public int getHealth() { return health; }
    public int getScore() { return score; }
}
```

---

### Gestion des entrées

```java
public class InputHandler implements KeyListener {
    private static boolean[] keys = new boolean[256];

    @Override
    public void keyPressed(KeyEvent e) {
        int code = e.getKeyCode();
        if (code >= 0 && code < keys.length) {
            keys[code] = true;
        }
    }

    @Override
    public void keyReleased(KeyEvent e) {
        int code = e.getKeyCode();
        if (code >= 0 && code < keys.length) {
            keys[code] = false;
        }
    }

    @Override
    public void keyTyped(KeyEvent e) {
        // Non utilisé
    }

    public static boolean isKeyPressed(int keyCode) {
        if (keyCode >= 0 && keyCode < keys.length) {
            return keys[keyCode];
        }
        return false;
    }
}
```

---

### Game Loop

```java
public class GameLoop implements Runnable {
    private boolean running;
    private GameEngine engine;
    private final int TARGET_FPS = 60;
    private final double TIME_PER_FRAME = 1.0 / TARGET_FPS;

    public GameLoop(GameEngine engine) {
        this.engine = engine;
        this.running = false;
    }

    @Override
    public void run() {
        running = true;
        double lastTime = System.nanoTime() / 1_000_000_000.0;
        double accumulator = 0;

        while (running) {
            double currentTime = System.nanoTime() / 1_000_000_000.0;
            double deltaTime = currentTime - lastTime;
            lastTime = currentTime;

            accumulator += deltaTime;

            // Mise à jour à taux fixe
            while (accumulator >= TIME_PER_FRAME) {
                engine.update(TIME_PER_FRAME);
                accumulator -= TIME_PER_FRAME;
            }

            // Rendu
            engine.render();

            // Limiter le FPS
            try {
                Thread.sleep(1);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        }
    }

    public void stop() {
        running = false;
    }
}
```

---

### États de jeu (Game States)

```java
public interface GameState {
    void enter();          // Appelé quand on entre dans cet état
    void exit();           // Appelé quand on quitte cet état
    void update(double deltaTime);
    void render(Graphics2D g);
}

public class PlayState implements GameState {
    private Player player;
    private List<Entity> entities;

    @Override
    public void enter() {
        player = new Player(100, 100);
        entities = new ArrayList<>();
        entities.add(player);
    }

    @Override
    public void exit() {
        // Nettoyage
    }

    @Override
    public void update(double deltaTime) {
        for (Entity entity : entities) {
            entity.update(deltaTime);
        }
        // Vérifier les collisions
        checkCollisions();
    }

    @Override
    public void render(Graphics2D g) {
        // Effacer l'écran
        g.setColor(Color.BLACK);
        g.fillRect(0, 0, 800, 600);

        // Dessiner les entités
        for (Entity entity : entities) {
            entity.render(g);
        }
    }

    private void checkCollisions() {
        // Logique de collision
    }
}
```

---

## Étapes Pratiques

### Étape 1 : Créer la fenêtre

```java
public class GameWindow extends JFrame {
    private GamePanel gamePanel;

    public GameWindow(String title, int width, int height) {
        setTitle(title);
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        setResizable(false);

        gamePanel = new GamePanel(width, height);
        add(gamePanel);

        pack();
        setLocationRelativeTo(null);
        setVisible(true);
    }

    public GamePanel getGamePanel() {
        return gamePanel;
    }
}
```

### Étape 2 : Créer le panneau de jeu

```java
public class GamePanel extends JPanel {
    private BufferedImage buffer;
    private Graphics2D graphics;

    public GamePanel(int width, int height) {
        setPreferredSize(new Dimension(width, height));
        setFocusable(true);
        buffer = new BufferedImage(width, height, BufferedImage.TYPE_INT_RGB);
        graphics = buffer.createGraphics();
    }

    public Graphics2D getGraphics2D() {
        return graphics;
    }

    public void display() {
        Graphics g = getGraphics();
        if (g != null) {
            g.drawImage(buffer, 0, 0, null);
            g.dispose();
        }
    }
}
```

### Étape 3 : Point d'entrée

```java
public class Main {
    public static void main(String[] args) {
        SwingUtilities.invokeLater(() -> {
            GameWindow window = new GameWindow("Mon Jeu 2D", 800, 600);
            GameEngine engine = new GameEngine(window.getGamePanel());

            InputHandler inputHandler = new InputHandler();
            window.addKeyListener(inputHandler);

            GameLoop loop = new GameLoop(engine);
            Thread gameThread = new Thread(loop);
            gameThread.start();
        });
    }
}
```

---

## Design Patterns Utiles

### Singleton (pour le moteur de jeu)

```java
// Option recommandée : holder idiom (thread-safe, pas de synchronized à chaque appel)
public class GameEngine {
    private GameEngine() {}

    private static class Holder {
        private static final GameEngine INSTANCE = new GameEngine();
    }

    public static GameEngine getInstance() {
        return Holder.INSTANCE;
    }
}
```

> **Note** : L'implémentation naïve (`if (instance == null) { instance = new GameEngine(); }`) est non thread-safe : deux threads peuvent créer deux instances simultanément. Le holder idiom évite ce problème sans coût de synchronisation à chaque appel.

### Factory (pour créer des entités)

```java
public class EntityFactory {
    public static Entity createEntity(String type, double x, double y) {
        switch (type) {
            case "player":
                return new Player(x, y);
            case "enemy":
                return new Enemy(x, y);
            default:
                throw new IllegalArgumentException("Type inconnu: " + type);
        }
    }
}
```

---

## Commandes Utiles

| Commande | Description |
| -------- | ----------- |
| `find src -name "*.java" \| xargs javac -d bin` | Compile tous les fichiers |
| `java -cp bin Main` | Lance le jeu |

---

## Pièges Fréquents

### Piège 1 : Mouvement dépendant du FPS

⚠️ **Problème** : Le jeu va plus vite sur un PC rapide.

✅ **Solution** : Utiliser deltaTime pour les calculs de mouvement.

```java
// ❌ Incorrect
x += 5;

// ✅ Correct
x += speed * deltaTime;
```

### Piège 2 : Modifier une liste pendant l'itération

⚠️ **Problème** : `ConcurrentModificationException`.

✅ **Solution** : Utiliser un itérateur ou une liste de suppression.

```java
// ❌ Incorrect
for (Entity e : entities) {
    if (e.isDead()) {
        entities.remove(e);
    }
}

// ✅ Correct
Iterator<Entity> it = entities.iterator();
while (it.hasNext()) {
    if (it.next().isDead()) {
        it.remove();
    }
}
```

### Piège 3 : Fuites de ressources graphiques

⚠️ **Problème** : Ne pas disposer des objets Graphics.

✅ **Solution** : Toujours appeler `dispose()` après utilisation.

---

### Piège 4 : Singleton naïf non thread-safe

⚠️ **Problème** : L'implémentation naïve du Singleton n'est pas thread-safe. Dans un jeu avec plusieurs threads (game loop + Swing EDT), deux threads peuvent créer deux instances simultanément.

```java
// ❌ Non thread-safe
private static GameEngine instance;
public static GameEngine getInstance() {
    if (instance == null) {
        instance = new GameEngine();  // Deux threads peuvent entrer ici en même temps
    }
    return instance;
}
```

✅ **Solution** : Utiliser le holder idiom (initialisation différée, thread-safe, sans synchronisation).

```java
// ✅ Holder idiom - thread-safe et efficace
private static class Holder {
    private static final GameEngine INSTANCE = new GameEngine();
}
public static GameEngine getInstance() {
    return Holder.INSTANCE;
}
```

---

## Checklist de Validation

- [ ] J'ai une structure de projet organisée
- [ ] J'ai une game loop fonctionnelle
- [ ] J'utilise deltaTime pour le mouvement
- [ ] J'ai une gestion des entrées clavier
- [ ] J'ai un système d'entités avec héritage
- [ ] Les collisions sont détectées

---

## Exercice Pratique

**Énoncé** : Ajouter un système de score au jeu. Créer une classe `ScoreManager` qui compte les points, affiche le score en haut de l'écran pendant le jeu, et sauvegarde le meilleur score dans un fichier texte. Au lancement, le meilleur score est chargé depuis le fichier.

**Indications** :

- La classe `ScoreManager` contient le score courant et le meilleur score (highscore)
- La méthode `addPoints(int points)` ajoute des points et met à jour le highscore si nécessaire
- La méthode `draw(Graphics2D g)` affiche le score et le highscore en haut de l'écran
- Utilise `FileWriter` et `BufferedReader` pour sauvegarder et charger le highscore

**Résultat attendu** : Le score s'affiche en haut à gauche de l'écran. Quand le joueur ferme le jeu, le meilleur score est sauvegardé. Au relancement, le meilleur score est restauré.

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

```java
import java.awt.Color;
import java.awt.Font;
import java.awt.Graphics2D;
import java.io.BufferedReader;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;

public class ScoreManager {
    // Score de la partie en cours
    private int score;
    // Meilleur score toutes parties confondues
    private int highScore;
    // Chemin du fichier de sauvegarde
    private static final String SAVE_FILE = "highscore.txt";
    // Police d'affichage du score
    private Font scoreFont;

    public ScoreManager() {
        this.score = 0;
        this.scoreFont = new Font("Arial", Font.BOLD, 20);
        // Charger le meilleur score depuis le fichier
        this.highScore = loadHighScore();
    }

    // Ajouter des points au score courant
    public void addPoints(int points) {
        score += points;
        // Mettre à jour le highscore si le score courant le dépasse
        if (score > highScore) {
            highScore = score;
        }
    }

    // Remettre le score à zéro (nouvelle partie)
    public void reset() {
        score = 0;
    }

    // Afficher le score et le highscore en haut de l'écran
    public void draw(Graphics2D g) {
        g.setFont(scoreFont);
        // Score courant en haut à gauche
        g.setColor(Color.WHITE);
        g.drawString("Score : " + score, 10, 25);
        // Meilleur score en haut à droite
        g.drawString("Meilleur : " + highScore, 600, 25);
    }

    // Sauvegarder le meilleur score dans un fichier texte
    public void saveHighScore() {
        try (FileWriter writer = new FileWriter(SAVE_FILE)) {
            // Écrire le highscore sous forme de texte
            writer.write(String.valueOf(highScore));
        } catch (IOException e) {
            System.err.println("Erreur lors de la sauvegarde du score : " + e.getMessage());
        }
    }

    // Charger le meilleur score depuis le fichier texte
    private int loadHighScore() {
        try (BufferedReader reader = new BufferedReader(new FileReader(SAVE_FILE))) {
            // Lire la première ligne et la convertir en entier
            String line = reader.readLine();
            if (line != null) {
                return Integer.parseInt(line.trim());
            }
        } catch (IOException e) {
            // Le fichier n'existe pas encore : c'est normal au premier lancement
        } catch (NumberFormatException e) {
            System.err.println("Fichier de score corrompu, réinitialisation.");
        }
        // Retourner 0 si le fichier n'existe pas ou est invalide
        return 0;
    }

    // Getters
    public int getScore() { return score; }
    public int getHighScore() { return highScore; }
}
```

**Utilisation dans le jeu** :

```java
// Dans PlayState ou GameEngine
ScoreManager scoreManager = new ScoreManager();

// Quand le joueur gagne des points
scoreManager.addPoints(10);

// Dans la méthode render()
scoreManager.draw(g);

// Quand le jeu se termine ou que la fenêtre se ferme
scoreManager.saveHighScore();
```

---

## Navigation

← Fiche précédente : **[Popeye (Docker)](01-popeye-docker.md)**
