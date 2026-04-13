<?php
include 'config.php';

// Verificar que existan materias primero
try {
    // Obtener el ID de Matemáticas
    $sql_matematicas = "SELECT id FROM materias_politecnico WHERE nombre = 'Matemáticas'";
    $stmt_matematicas = $pdo->query($sql_matematicas);
    $matematicas_id = $stmt_matematicas->fetchColumn();

    if (!$matematicas_id) {
        die("❌ Primero debes insertar la materia 'Matemáticas'. <a href='insertar_materias_poli.php'>Insertar materias</a>");
    }

    echo "<div style='background: #e8f5e9; padding: 10px; border-radius: 5px; margin: 10px 0;'>";
    echo "✅ ID de Matemáticas encontrado: $matematicas_id";
    echo "</div>";

} catch (PDOException $e) {
    die("❌ Error al verificar materias: " . $e->getMessage());
}

// Las 30 preguntas de matemáticas de la guía 2025
$preguntas_matematicas = [
    // Pregunta 1
    [
        'materia_id' => $matematicas_id,
        'pregunta_texto' => 'Una persona caminó durante media hora y luego consiguió un aventón que duró la tercera parte de una hora. ¿Qué parte de una hora duró el viaje completo?',
        'opcion_a' => '3/2',
        'opcion_b' => '5/6',
        'opcion_c' => '4/3',
        'opcion_d' => '8/6',
        'respuesta_correcta' => 'B',
        'explicacion' => 'Media hora = 1/2, tercera parte de hora = 1/3. Suma: 1/2 + 1/3 = 3/6 + 2/6 = 5/6',
        'tema' => 'Fracciones',
        'nivel_dificultad' => 'facil'
    ],

    // Pregunta 2
    [
        'materia_id' => $matematicas_id,
        'pregunta_texto' => 'Es el polígono que se forma por la intersección de tres segmentos y la suma de sus ángulos interiores es de 180°.',
        'opcion_a' => 'Cuadrilátero',
        'opcion_b' => 'Pentágono',
        'opcion_c' => 'Heptágono',
        'opcion_d' => 'Triángulo',
        'respuesta_correcta' => 'D',
        'explicacion' => 'El triángulo tiene 3 lados y la suma de sus ángulos internos es siempre 180°',
        'tema' => 'Geometría',
        'nivel_dificultad' => 'facil'
    ],

    // Pregunta 3
    [
        'materia_id' => $matematicas_id,
        'pregunta_texto' => 'Es la solución de la siguiente ecuación: 3x - 11 = x - 7',
        'opcion_a' => 'x = 2',
        'opcion_b' => 'x = 1',
        'opcion_c' => 'x = 4/7',
        'opcion_d' => 'x = 1/2',
        'respuesta_correcta' => 'A',
        'explicacion' => '3x - 11 = x - 7 → 3x - x = -7 + 11 → 2x = 4 → x = 2',
        'tema' => 'Ecuaciones lineales',
        'nivel_dificultad' => 'facil'
    ],

    // Pregunta 4
    [
        'materia_id' => $matematicas_id,
        'pregunta_texto' => 'Compre 4 peras por $58. Si necesito comprar 7 peras más, deberé pagar...',
        'opcion_a' => '$76.5',
        'opcion_b' => '$85.5',
        'opcion_c' => '$101.5',
        'opcion_d' => '$104.5',
        'respuesta_correcta' => 'C',
        'explicacion' => 'Precio por pera: $58 ÷ 4 = $14.5. Para 7 peras: 7 × $14.5 = $101.5',
        'tema' => 'Proporcionalidad',
        'nivel_dificultad' => 'medio'
    ],

    // Pregunta 5
    [
        'materia_id' => $matematicas_id,
        'pregunta_texto' => 'Ordena las ecuaciones de forma ascendente de acuerdo a su solución

1. x² - 6x + 9 = 0
2. x² - 4x + 4 = 0
3. x² - 8x + 16 = 0
4. x² - 2x + 1 = 0',
        'opcion_a' => '1, 3, 2, 4',
        'opcion_b' => '2, 1, 4, 3',
        'opcion_c' => '3, 4, 1, 2',
        'opcion_d' => '4, 2, 1, 3',
        'respuesta_correcta' => 'D',
        'explicacion' => '1. (x-3)²=0 → x=3; 2. (x-2)²=0 → x=2; 3. (x-4)²=0 → x=4; 4. (x-1)²=0 → x=1. Orden: 4,2,1,3',
        'tema' => 'Ecuaciones cuadráticas',
        'nivel_dificultad' => 'medio'
    ],

    // Pregunta 6
    [
        'materia_id' => $matematicas_id,
        'pregunta_texto' => 'Si la arista de un exaedro regular mide 3m. Su área es de ___ m², su volumen es de ___ m³ y ___ m representa el perímetro.',
        'opcion_a' => '16, 18, 12',
        'opcion_b' => '19, 27, 72',
        'opcion_c' => '36, 18, 24',
        'opcion_d' => '54, 27, 36',
        'respuesta_correcta' => 'D',
        'explicacion' => 'Exaedro = cubo. Área: 6 × (3×3) = 54 m². Volumen: 3³ = 27 m³. Perímetro: 12 aristas × 3 = 36 m',
        'tema' => 'Geometría sólida',
        'nivel_dificultad' => 'medio'
    ],

    // Pregunta 7
    [
        'materia_id' => $matematicas_id,
        'pregunta_texto' => 'Relaciona el producto con su respectivo desarrollo

1. 2x(x² - 8) =
2. 3x(2x + 1) =
3. (x - 5)4 =
4. (8x² + 12x)5x =

Desarrollo:
a) 40x² + 60x²
b) 2x² - 16x
c) 6x² + 3x
d) 4x - 20',
        'opcion_a' => '1a, 2d, 3c, 4b',
        'opcion_b' => '1b, 2c, 3d, 4a',
        'opcion_c' => '1c, 2d, 3a, 4b',
        'opcion_d' => '1d, 2a, 3b, 4c',
        'respuesta_correcta' => 'B',
        'explicacion' => '1. 2x(x²-8)=2x³-16x (b); 2. 3x(2x+1)=6x²+3x (c); 3. (x-5)4=4x-20 (d); 4. (8x²+12x)5x=40x³+60x² (a)',
        'tema' => 'Álgebra',
        'nivel_dificultad' => 'medio'
    ],

    // Pregunta 8
    [
        'materia_id' => $matematicas_id,
        'pregunta_texto' => 'Elije las expresiones algebraicas que aplican la ley de los radicales de manera correcta.

1. ³√(xy) = ³√x · ³√y
2. (³√x)⁵ = x²⁵
3. ³√(125/27) = 5/3
4. ³√(x²) = x²
5. ³√(√x) = √⁶x
6. (³√(ab))² = ab
7. ³√(√x) = √⁶x',
        'opcion_a' => '1,3,4,6,7',
        'opcion_b' => '1,4,5,6,7',
        'opcion_c' => '2,3,4,5,6',
        'opcion_d' => '3,4,5,6,7',
        'respuesta_correcta' => 'A',
        'explicacion' => 'Correctas: 1, 3, 4, 6, 7. La 2 es incorrecta: (³√x)⁵ = x^(5/3). La 5 es incorrecta: ³√(√x) = x^(1/6)',
        'tema' => 'Radicales',
        'nivel_dificultad' => 'dificil'
    ],

    // Pregunta 9
    [
        'materia_id' => $matematicas_id,
        'pregunta_texto' => 'Selecciona las operaciones que son correctas.

1. 2¾ + 5⅞ = 22/47
2. ⅞ ÷ 9 = 7/72
3. 5/3 ÷ 2¾ = 20/33
4. 9 ÷ 6⅖ = 288/5
5. 9/5 ÷ 8/7 = 63/40
6. ¾ ÷ 8 = 14',
        'opcion_a' => '1,3,5',
        'opcion_b' => '2,4,6',
        'opcion_c' => '3,5,6',
        'opcion_d' => '1,2,4',
        'respuesta_correcta' => 'A',
        'explicacion' => 'Correctas según guía: 1, 3, 5. La 1: 11/4 + 47/8 = 69/8 = 8⅝. La 3: 5/3 ÷ 11/4 = 20/33. La 5: 9/5 × 7/8 = 63/40',
        'tema' => 'Operaciones con fracciones',
        'nivel_dificultad' => 'medio'
    ],

    // Pregunta 10
    [
        'materia_id' => $matematicas_id,
        'pregunta_texto' => '¿Cuánto suman los ángulos interiores de un hexágono?',
        'opcion_a' => '180°',
        'opcion_b' => '360°',
        'opcion_c' => '540°',
        'opcion_d' => '720°',
        'respuesta_correcta' => 'D',
        'explicacion' => 'Fórmula: (n-2)×180° = (6-2)×180° = 4×180° = 720°. Un hexágono se puede dividir en 4 triángulos: 4×180°=720°',
        'tema' => 'Geometría',
        'nivel_dificultad' => 'facil'
    ],

    // Pregunta 11
    [
        'materia_id' => $matematicas_id,
        'pregunta_texto' => 'Es el teorema que enuncia: El cuadrado de la hipotenusa es igual a la suma de los cuadrados de los catetos.',
        'opcion_a' => 'Arquímedes',
        'opcion_b' => 'Euclides',
        'opcion_c' => 'Pitágoras',
        'opcion_d' => 'Tales',
        'respuesta_correcta' => 'C',
        'explicacion' => 'Teorema de Pitágoras: a² + b² = c², donde c es la hipotenusa',
        'tema' => 'Geometría',
        'nivel_dificultad' => 'facil'
    ],

    // Pregunta 12
    [
        'materia_id' => $matematicas_id,
        'pregunta_texto' => 'El costo de las entradas a una función de cine es de $60 para los adultos y $40 para los niños. Si el sábado pasado asistieron 248 personas y se recaudaron $11860, la asistencia repartida en adultos y niños es:',
        'opcion_a' => '48 adultos y 200 niños',
        'opcion_b' => '69 adultos y 179 niños',
        'opcion_c' => '97 adultos y 151 niños',
        'opcion_d' => '112 adultos y 136 niños',
        'respuesta_correcta' => 'C',
        'explicacion' => 'Sistema: x+y=248, 60x+40y=11860. Multiplicando primera por -40: -40x-40y=-9920. Sumando: 20x=1940 → x=97 adultos, y=151 niños',
        'tema' => 'Sistemas de ecuaciones',
        'nivel_dificultad' => 'medio'
    ],

    // Pregunta 13
    [
        'materia_id' => $matematicas_id,
        'pregunta_texto' => 'Un ángulo es inscrito cuando su vértice...',
        'opcion_a' => 'está en algún punto de la circunferencia',
        'opcion_b' => 'está en el centro de la circunferencia',
        'opcion_c' => 'no toca ningún punto de la circunferencia',
        'opcion_d' => 'está fuera de la circunferencia',
        'respuesta_correcta' => 'A',
        'explicacion' => 'Un ángulo inscrito es cualquier ángulo que su vértice está en algún punto de la circunferencia y sus lados son secantes a la misma',
        'tema' => 'Geometría',
        'nivel_dificultad' => 'facil'
    ],

    // Pregunta 14
    [
        'materia_id' => $matematicas_id,
        'pregunta_texto' => 'Ordena de manera ascendente el valor de las hipotenusas de los triángulos:

1. Catetos: 3 y 4
2. Catetos: 6 y 8  
3. Catetos: 5 y 12
4. Catetos: 8 y 15',
        'opcion_a' => '1, 2, 4, 3',
        'opcion_b' => '2, 4, 3, 1',
        'opcion_c' => '3, 2, 1, 4',
        'opcion_d' => '4, 1, 2, 3',
        'respuesta_correcta' => 'A',
        'explicacion' => 'Hipotenusas: 1)√(3²+4²)=5; 2)√(6²+8²)=10; 3)√(5²+12²)=13; 4)√(8²+15²)=17. Orden: 1,2,4,3',
        'tema' => 'Teorema de Pitágoras',
        'nivel_dificultad' => 'medio'
    ],

    // Pregunta 15
    [
        'materia_id' => $matematicas_id,
        'pregunta_texto' => 'Si con 240 kg de trigo se obtienen 150 kg de harina y con los 150 kg de harina se producen 180 kg de pan, entonces con 400 kg de trigo se producen ___ kg de harina y ___ kg de pan.',
        'opcion_a' => '250, 300',
        'opcion_b' => '300, 250',
        'opcion_c' => '320, 240',
        'opcion_d' => '350, 260',
        'respuesta_correcta' => 'A',
        'explicacion' => 'Harina: (400×150)/240=250 kg. Pan: (250×180)/150=300 kg',
        'tema' => 'Proporcionalidad',
        'nivel_dificultad' => 'medio'
    ],

    // Pregunta 16
    [
        'materia_id' => $matematicas_id,
        'pregunta_texto' => 'Relaciona la fórmula del volumen con el cuerpo geométrico.

Fórmula:
1. V = πr²h
2. V = (4/3)πr³
3. V = (1/3)πr²h
4. V = a³

Cuerpo geométrico:
a) Cono
b) Cilindro  
c) Cubo
d) Esfera
e) Pirámide',
        'opcion_a' => '1a, 2b, 3c, 4e',
        'opcion_b' => '1b, 2d, 3a, 4c',
        'opcion_c' => '1c, 2e, 3b, 4a',
        'opcion_d' => '1d, 2a, 3e, 4c',
        'respuesta_correcta' => 'B',
        'explicacion' => '1. πr²h → Cilindro (b); 2. (4/3)πr³ → Esfera (d); 3. (1/3)πr²h → Cono (a); 4. a³ → Cubo (c)',
        'tema' => 'Geometría',
        'nivel_dificultad' => 'medio'
    ],

    // Pregunta 17
    [
        'materia_id' => $matematicas_id,
        'pregunta_texto' => 'Selecciona los triángulos que son semejantes.',
        'opcion_a' => '1, 2, 3, 4',
        'opcion_b' => '1, 3, 4, 5',
        'opcion_c' => '2, 3, 5, 6',
        'opcion_d' => '2, 4, 5, 6',
        'respuesta_correcta' => 'D',
        'explicacion' => 'Según el PDF: Los triángulos 2, 4, 5, 6 son semejantes. Criterio LAL: tienen ángulo recto y lados proporcionales',
        'tema' => 'Geometría - Semejanza',
        'nivel_dificultad' => 'dificil'
    ],

    // Pregunta 18
    [
        'materia_id' => $matematicas_id,
        'pregunta_texto' => 'Una rana está sentada en la abscisa 9 de la recta numérica, salta de manera alternada a la izquierda 3 unidades y luego a la derecha dos unidades, ¿cuántos saltos tiene que dar para llegar al origen de la recta numérica?',
        'opcion_a' => '9',
        'opcion_b' => '11',
        'opcion_c' => '13',
        'opcion_d' => '15',
        'respuesta_correcta' => 'C',
        'explicacion' => 'Según tabla del PDF: Después de 13 saltos llega a 0. Secuencia: 9→6→8→5→7→4→6→3→5→2→4→1→3→0',
        'tema' => 'Problemas aritméticos',
        'nivel_dificultad' => 'dificil'
    ],

    // Pregunta 19
    [
        'materia_id' => $matematicas_id,
        'pregunta_texto' => 'Son dos o más términos que tienen diferentes coeficientes numéricos, misma parte literal e iguales exponentes.',
        'opcion_a' => 'Consecutivos',
        'opcion_b' => 'Iguales',
        'opcion_c' => 'Progresivos',
        'opcion_d' => 'Semejantes',
        'respuesta_correcta' => 'D',
        'explicacion' => 'Se le llama términos semejantes a 2 o más términos que tienen diferentes coeficientes numéricos, misma parte literal e iguales exponentes',
        'tema' => 'Álgebra',
        'nivel_dificultad' => 'facil'
    ],

    // Pregunta 20
    [
        'materia_id' => $matematicas_id,
        'pregunta_texto' => 'Encontrar la mediana de la siguiente serie de números:

15, 7, 18, 17, 9, 17, 8, 6, 18, 17',
        'opcion_a' => '15',
        'opcion_b' => '16',
        'opcion_c' => '17',
        'opcion_d' => '18',
        'respuesta_correcta' => 'B',
        'explicacion' => 'Ordenados: 6,7,8,9,15,17,17,17,18,18. Mediana = (15+17)/2 = 16',
        'tema' => 'Estadística',
        'nivel_dificultad' => 'medio'
    ],

    // Pregunta 21
    [
        'materia_id' => $matematicas_id,
        'pregunta_texto' => 'La moda de la siguiente serie de números es...
6, 14, 9, 7, 6, 12, 9, 7, 12, 9',
        'opcion_a' => '6',
        'opcion_b' => '7',
        'opcion_c' => '9',
        'opcion_d' => '12',
        'respuesta_correcta' => 'C',
        'explicacion' => 'El 9 se repite 3 veces, el 6 y 7 se repiten 2 veces cada uno, el 12 se repite 2 veces. Moda = 9',
        'tema' => 'Estadística',
        'nivel_dificultad' => 'facil'
    ],

    // Pregunta 22
    [
        'materia_id' => $matematicas_id,
        'pregunta_texto' => 'Dado el siguiente triángulo rectángulo: Ordena en forma ascendente las razones trigonométricas, con base en su resultado.
1. sen a
2. cos a
3. tan a
4. cot a',
        'opcion_a' => '1, 3, 2, 4',
        'opcion_b' => '2, 4, 3, 1',
        'opcion_c' => '3, 1, 4, 2',
        'opcion_d' => '4, 2, 1, 3',
        'respuesta_correcta' => 'A',
        'explicacion' => 'Según PDF: sen a=9/15=0.60; tan a=9/12=0.75; cos a=12/15=0.80; cot a=12/9=1.33. Orden: 1,3,2,4',
        'tema' => 'Trigonometría',
        'nivel_dificultad' => 'medio'
    ],

    // Pregunta 23
    [
        'materia_id' => $matematicas_id,
        'pregunta_texto' => 'Valeria compró un costal lleno de alpiste para su canario. El primer día, se comió ½ del total, el segundo día se comió ⅓ del restante y el tercer día se comió ¼ del sobrante; Esto significa que en el segundo día el canario se comió ___ del total y ___ del total en el tercero, por lo que sobra ___ del total.',
        'opcion_a' => '1/6, 1/12, 1/4',
        'opcion_b' => '1/6, 1/4, 1/12',
        'opcion_c' => '1/4, 1/6, 1/12',
        'opcion_d' => '1/4, 1/12, 1/6',
        'respuesta_correcta' => 'A',
        'explicacion' => 'Día 1: 1/2 → queda 1/2. Día 2: 1/3 de 1/2 = 1/6 → queda 1/3. Día 3: 1/4 de 1/3 = 1/12 → queda 1/4',
        'tema' => 'Fracciones',
        'nivel_dificultad' => 'medio'
    ],

    // Pregunta 24
    [
        'materia_id' => $matematicas_id,
        'pregunta_texto' => 'Relaciona la clasificación de los ángulos con su medida en grados.

Clasificación:
1. Perigonal
2. Llano
3. Recto
4. Agudo
5. Obtuso
6. Cóncavo

Medida:
a) 180°
b) Más de 0° y menos de 90°
c) Más de 90° y menos de 180°
d) 90°
e) Más de 180° y menos de 360°
f) 360°',
        'opcion_a' => '1a, 2d, 3f, 4b, 5c, 6e',
        'opcion_b' => '1b, 2c, 3a, 4e, 5d, 6f',
        'opcion_c' => '1e, 2f, 3a, 4c, 5b, 6d',
        'opcion_d' => '1f, 2a, 3d, 4b, 5c, 6e',
        'respuesta_correcta' => 'D',
        'explicacion' => '1→360°(f); 2→180°(a); 3→90°(d); 4→Más de 0° y <90°(b); 5→Más de 90° y <180°(c); 6→Más de 180° y <360°(e)',
        'tema' => 'Geometría',
        'nivel_dificultad' => 'medio'
    ],

    // Pregunta 25
    [
        'materia_id' => $matematicas_id,
        'pregunta_texto' => 'Selecciona las razones trigonométricas del seno, secante y cotangente del ángulo "a", que le corresponde al siguiente triángulo.',
        'opcion_a' => 'sen a = 3/5, sec a = 5/4, cot a = 4/3',
        'opcion_b' => 'sen a = 4/5, sec a = 5/3, cot a = 3/4',
        'opcion_c' => 'sen a = 3/5, sec a = 5/3, cot a = 4/3',
        'opcion_d' => 'sen a = 4/5, sec a = 5/4, cot a = 3/4',
        'respuesta_correcta' => 'C',
        'explicacion' => 'Suponiendo triángulo 3-4-5: sen a = 3/5, sec a = 5/3, cot a = 4/3',
        'tema' => 'Trigonometría',
        'nivel_dificultad' => 'medio'
    ],

    // Pregunta 26
    [
        'materia_id' => $matematicas_id,
        'pregunta_texto' => 'De las gráficas de barras se observa que la cantidad de datos que se tienen es de 15. Para una frecuencia de 5, ¿qué porcentaje representa?',
        'opcion_a' => '20%',
        'opcion_b' => '25%',
        'opcion_c' => '33%',
        'opcion_d' => '40%',
        'respuesta_correcta' => 'C',
        'explicacion' => '5/15 = 0.333 = 33.3% ≈ 33%',
        'tema' => 'Estadística',
        'nivel_dificultad' => 'facil'
    ],

    // Pregunta 27
    [
        'materia_id' => $matematicas_id,
        'pregunta_texto' => 'Ordena en forma ascendente de acuerdo con el contenido de agua de las cisternas si solo se llena ¾ partes de su altura.',
        'opcion_a' => '1,3,4,2',
        'opcion_b' => '2,4,1,3',
        'opcion_c' => '3,2,4,1',
        'opcion_d' => '4,1,2,3',
        'respuesta_correcta' => 'C',
        'explicacion' => 'Según PDF: Volúmenes: 1=9m³, 2=4.5m³, 3=3.93m³, 4=8.43m³. Orden ascendente: 3,2,4,1',
        'tema' => 'Geometría',
        'nivel_dificultad' => 'medio'
    ],

    // Pregunta 28
    [
        'materia_id' => $matematicas_id,
        'pregunta_texto' => 'Organiza los productos en forma descendente de acuerdo con las ganancias obtenidas.

Productos:
1. Refresco: costo $12, venta $15, vendidos 30
2. Agua: costo $10, venta $12, vendidos 20
3. Pastilla: costo $3, venta $5, vendidos 40
4. Chicle: costo $2, venta $3, vendidos 70
5. Paleta: costo $4, venta $8, vendidos 45',
        'opcion_a' => '2,1,4,3,5',
        'opcion_b' => '2,3,5,1,4',
        'opcion_c' => '4,1,5,3,2',
        'opcion_d' => '5,1,3,4,2',
        'respuesta_correcta' => 'D',
        'explicacion' => 'Ganancias: 1: (15-12)×30=90; 2: (12-10)×20=40; 3: (5-3)×40=80; 4: (3-2)×70=70; 5: (8-4)×45=180. Orden descendente: 5,1,3,4,2',
        'tema' => 'Problemas de aplicación',
        'nivel_dificultad' => 'medio'
    ],

    // Pregunta 29
    [
        'materia_id' => $matematicas_id,
        'pregunta_texto' => '¿Cuál es la probabilidad de que el primer cliente haya elegido una bebida? (Refresco o Agua)',
        'opcion_a' => '6/41',
        'opcion_b' => '10/41',
        'opcion_c' => '20/41',
        'opcion_d' => '41/41',
        'respuesta_correcta' => 'B',
        'explicacion' => 'Total vendido: 30+20+40+70+45=205. Bebidas: 30+20=50. Probabilidad: 50/205 = 10/41',
        'tema' => 'Probabilidad',
        'nivel_dificultad' => 'medio'
    ],

    // Pregunta 30
    [
        'materia_id' => $matematicas_id,
        'pregunta_texto' => 'Relaciona el producto con el porcentaje de productos vendidos

Producto:
1. Refresco
2. Aguas
3. Pastillas
4. Chicles
5. Paletas

Porcentaje:
a) 9.75%
b) 14.75%
c) 19.51%
d) 21.95%
e) 34.14%',
        'opcion_a' => '1a, 2d, 3c, 4b, 5e',
        'opcion_b' => '1b, 2a, 3c, 4e, 5d',
        'opcion_c' => '1b, 2a, 3e, 4d, 5c',
        'opcion_d' => '1e, 2c, 3b, 4d, 5a',
        'respuesta_correcta' => 'B',
        'explicacion' => 'Total: 205. %: Refresco=30/205=14.63%≈14.75%(b); Agua=20/205=9.76%≈9.75%(a); Pastillas=40/205=19.51%(c); Chicles=70/205=34.15%≈34.14%(e); Paletas=45/205=21.95%(d)',
        'tema' => 'Porcentajes',
        'nivel_dificultad' => 'medio'
    ]
];

try {
    // Verificar si ya existen preguntas de matemáticas
    $sql_check = "SELECT COUNT(*) as total FROM preguntas_politecnico WHERE materia_id = ?";
    $stmt_check = $pdo->prepare($sql_check);
    $stmt_check->execute([$matematicas_id]);
    $count = $stmt_check->fetch();

    if ($count['total'] == 0) {
        // Preparar la consulta de inserción - AJUSTADA CON COLUMNAS NUEVAS Y DESCRIBE REAL
        $sql = "INSERT INTO preguntas_politecnico (
            guia_year, numero_pregunta, materia_id, pregunta_texto, opcion_a, opcion_b, opcion_c, opcion_d, 
            respuesta_correcta, explicación, tema, nivel_dificultad, activa
        ) VALUES (2025, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)";
        $stmt = $pdo->prepare($sql);

        $insertadas = 0;
        foreach ($preguntas_matematicas as $index => $pregunta) {
            $numero_pregunta = $index + 1;
            $stmt->execute([
                $numero_pregunta,
                $pregunta['materia_id'],
                $pregunta['pregunta_texto'],
                $pregunta['opcion_a'],
                $pregunta['opcion_b'],
                $pregunta['opcion_c'],
                $pregunta['opcion_d'],
                $pregunta['respuesta_correcta'],
                $pregunta['explicacion'],
                $pregunta['tema'],
                $pregunta['nivel_dificultad']
            ]);
            $insertadas++;
        }

        echo "<h2 style='color: #1a237e;'>✅ ¡Preguntas de Matemáticas insertadas correctamente!</h2>";
        echo "<div style='background: #d4edda; padding: 15px; border-radius: 5px; margin: 15px 0;'>";
        echo "<p><strong>Total insertadas:</strong> $insertadas preguntas</p>";
        echo "<p><strong>Materia:</strong> Matemáticas</p>";
        echo "<p><strong>Fuente:</strong> Guía oficial 2025</p>";
        echo "</div>";

    } else {
        echo "<h3 style='color: #d50000;'>⚠️ Ya existen preguntas de Matemáticas en la base de datos</h3>";
        echo "<p>Actualmente hay {$count['total']} preguntas de Matemáticas.</p>";
        echo "<p><a href='#' onclick='if(confirm(\"¿Borrar preguntas existentes e insertar las nuevas?\")) { window.location = \"?force=1\"; }'>Forzar inserción (borrar existentes)</a></p>";
    }

    // Manejar forzado de inserción
    if (isset($_GET['force']) && $_GET['force'] == 1) {
        $sql_delete = "DELETE FROM preguntas_politecnico WHERE materia_id = ?";
        $stmt_delete = $pdo->prepare($sql_delete);
        $stmt_delete->execute([$matematicas_id]);

        // Re-insertar
        $sql = "INSERT INTO preguntas_politecnico (
            guia_year, numero_pregunta, materia_id, pregunta_texto, opcion_a, opcion_b, opcion_c, opcion_d, 
            respuesta_correcta, explicación, tema, nivel_dificultad, activa
        ) VALUES (2025, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)";
        $stmt = $pdo->prepare($sql);

        $insertadas = 0;
        foreach ($preguntas_matematicas as $index => $pregunta) {
            $numero_pregunta = $index + 1;
            $stmt->execute([
                $numero_pregunta,
                $pregunta['materia_id'],
                $pregunta['pregunta_texto'],
                $pregunta['opcion_a'],
                $pregunta['opcion_b'],
                $pregunta['opcion_c'],
                $pregunta['opcion_d'],
                $pregunta['respuesta_correcta'],
                $pregunta['explicacion'],
                $pregunta['tema'],
                $pregunta['nivel_dificultad']
            ]);
            $insertadas++;
        }

        echo "<h2 style='color: #1a237e;'>✅ ¡Preguntas re-insertadas correctamente!</h2>";
        echo "<div style='background: #d4edda; padding: 15px; border-radius: 5px; margin: 15px 0;'>";
        echo "<p><strong>Total insertadas:</strong> $insertadas preguntas</p>";
        echo "</div>";
    }

    // Mostrar resumen
    echo "<h3>📋 Resumen de las preguntas (1-30):</h3>";
    echo "<div style='max-height: 400px; overflow-y: auto; border: 1px solid #ddd; padding: 15px; border-radius: 5px;'>";

    foreach ($preguntas_matematicas as $index => $pregunta) {
        $numero = $index + 1;
        echo "<div style='border-bottom: 1px solid #eee; padding: 10px 0; margin-bottom: 10px;'>";
        echo "<strong>Pregunta #{$numero}</strong><br>";
        echo "<strong>Tema:</strong> {$pregunta['tema']} | ";
        echo "<strong>Dificultad:</strong> {$pregunta['nivel_dificultad']}<br>";
        $texto_corto = strlen($pregunta['pregunta_texto']) > 80 ? substr($pregunta['pregunta_texto'], 0, 80) . "..." : $pregunta['pregunta_texto'];
        echo "<strong>Pregunta:</strong> $texto_corto<br>";
        echo "<strong>Respuesta correcta:</strong> {$pregunta['respuesta_correcta']}<br>";
        echo "</div>";
    }

    echo "</div>";

    // Mostrar estadísticas
    $sql_stats = "SELECT 
        COUNT(*) as total_preguntas,
        COUNT(DISTINCT materia_id) as materias_con_preguntas,
        COUNT(DISTINCT tema) as temas_diferentes
        FROM preguntas_politecnico WHERE activa = 1";
    $stmt_stats = $pdo->query($sql_stats);
    $stats = $stmt_stats->fetch();

    echo "<h3>📊 Estadísticas actualizadas:</h3>";
    echo "<div style='display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; margin: 20px 0;'>";
    echo "<div style='background: #e3f2fd; padding: 15px; border-radius: 5px; text-align: center;'>";
    echo "<div style='font-size: 24px; font-weight: bold; color: #1a237e;'>{$stats['total_preguntas']}</div>";
    echo "<div>Total de preguntas activas</div>";
    echo "</div>";

    echo "<div style='background: #f3e5f5; padding: 15px; border-radius: 5px; text-align: center;'>";
    echo "<div style='font-size: 24px; font-weight: bold; color: #7b1fa2;'>{$stats['materias_con_preguntas']}</div>";
    echo "<div>Materias con preguntas</div>";
    echo "</div>";

    echo "<div style='background: #e8f5e9; padding: 15px; border-radius: 5px; text-align: center;'>";
    echo "<div style='font-size: 24px; font-weight: bold; color: #2e7d32;'>{$stats['temas_diferentes']}</div>";
    echo "<div>Temas diferentes</div>";
    echo "</div>";
    echo "</div>";

} catch (PDOException $e) {
    echo "<div style='background: #f8d7da; color: #721c24; padding: 15px; border-radius: 5px;'>";
    echo "<h3>❌ Error al insertar preguntas</h3>";
    echo "<p><strong>Error:</strong> " . $e->getMessage() . "</p>";
    if (isset($sql)) {
        echo "<p><strong>Consulta:</strong> " . htmlspecialchars($sql) . "</p>";
    }
    echo "</div>";
}
?>

<div style="margin-top: 40px; padding: 20px; background: #1a237e; color: white; border-radius: 10px;">
    <h3>🔗 Acciones disponibles:</h3>
    <div style="display: flex; gap: 15px; margin-top: 15px; flex-wrap: wrap;">
        <a href="simulador_politecnico.php?materias[]=Matemáticas&limit=30&modo=estudio"
            style="padding: 12px 25px; background: #ffab00; color: #333; text-decoration: none; border-radius: 5px; font-weight: bold;">
            🧮 Probar Matemáticas (Modo Estudio)
        </a>

        <a href="simulador_politecnico.php?materias[]=Matemáticas&limit=30&modo=examen"
            style="padding: 12px 25px; background: #d50000; color: white; text-decoration: none; border-radius: 5px; font-weight: bold;">
            ⚔️ Simulacro Matemáticas (Modo Examen)
        </a>

        <a href="admin_poli.php"
            style="padding: 12px 25px; background: white; color: #1a237e; text-decoration: none; border-radius: 5px; font-weight: bold;">
            ⚙️ Panel de Administración
        </a>
    </div>
</div>

<style>
    body {
        font-family: Arial, sans-serif;
        max-width: 1000px;
        margin: 0 auto;
        padding: 20px;
        background: #f5f5f5;
    }

    h2,
    h3,
    h4 {
        color: #1a237e;
    }

    a {
        color: #1a237e;
        text-decoration: none;
    }

    a:hover {
        text-decoration: underline;
    }
</style>