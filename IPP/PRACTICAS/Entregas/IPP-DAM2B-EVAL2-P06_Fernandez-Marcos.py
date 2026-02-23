import pygame
import sys

# 1. Inicializar pygame
pygame.init()

# 2. Configuración de la pantalla
ANCHO = 800
ALTO = 600
pantalla = pygame.display.set_mode((ANCHO, ALTO))
pygame.display.set_caption("Mi Primer Juego - Mover Cuadrado")

# Colores (R, G, B)
NEGRO = (0, 0, 0)
BLANCO = (255, 255, 255)
AZUL = (0, 0, 255)

# Reloj para controlar FPS
reloj = pygame.time.Clock() 

# Variables del jugador
jugador_tam = 50
jugador_x = ANCHO // 2
jugador_y = ALTO - 2 * jugador_tam
velocidad = 5

# Bucle principal
ejecutando = True
while ejecutando:

    # 1. Gestionar eventos (cerrar ventana)
    for evento in pygame.event.get():
        if evento.type == pygame.QUIT:
            ejecutando = False

    # 2. Lógica del movimiento
    keys = pygame.key.get_pressed()
    if keys[pygame.K_LEFT] and jugador_x > 0:
        jugador_x -= velocidad
    if keys[pygame.K_RIGHT] and jugador_x < ANCHO - jugador_tam:
        jugador_x += velocidad
    if keys[pygame.K_UP] and jugador_y > 0:
        jugador_y -= velocidad
    if keys[pygame.K_DOWN] and jugador_y < ALTO - jugador_tam:
        jugador_y += velocidad

    # 3. Dibujar en pantalla
    pantalla.fill(NEGRO) # Limpiar pantalla (pintar de negro)

    # Dibujar jugador
    pygame.draw.rect(pantalla, AZUL, (jugador_x, jugador_y, jugador_tam,
    jugador_tam))

    # 4. Actualizar pantalla
    pygame.display.flip()

    # 5. FPS (frames por segundo)
    reloj.tick(60)

pygame.quit()
sys.exit()