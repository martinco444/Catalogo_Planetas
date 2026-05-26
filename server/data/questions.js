// Preguntas por planeta - formato: { id, question, choices, correctIndex }
module.exports = {
  Mercury: [
    { id: 'm1', question: '¿Cuál es el planeta más cercano al Sol?', choices: ['Mercurio','Venus','Tierra','Marte'], correctIndex: 0 },
    { id: 'm2', question: '¿Cuántas lunas tiene Mercurio?', choices: ['0','1','2','3'], correctIndex: 0 },
    { id: 'm3', question: '¿Mercurio tiene una atmósfera densa?', choices: ['Sí','No','Solo en polos','Solo en verano'], correctIndex: 1 },
    { id: 'm4', question: '¿Cuál es una característica destacada de Mercurio?', choices: ['Muchos cráteres','Anillos','Grandes océanos','Cientos de lunas'], correctIndex: 0 },
    { id: 'm5', question: '¿Mercurio es más pequeño que la Tierra?', choices: ['Sí','No','Mismo tamaño','No se sabe'], correctIndex: 0 },
    { id: 'm6', question: '¿Mercurio completa una órbita alrededor del Sol en menos de un año terrestre?', choices: ['Sí','No','Toma varios años','Nunca completa una órbita'], correctIndex: 0 },
    { id: 'm7', question: '¿Mercurio posee anillos?', choices: ['No','Sí','Solo temporalmente','Solo en latitudes altas'], correctIndex: 0 },
    { id: 'm8', question: '¿Mercurio tiene una superficie sólida?', choices: ['Sí','No, es gaseoso','Es líquido','Es plasma'], correctIndex: 0 },
    { id: 'm9', question: '¿Mercurio tiene un núcleo metálico grande?', choices: ['Sí','No, es pequeño','Está vacío','Es rocoso'], correctIndex: 0 },
    { id: 'm10', question: '¿Cuál es el color típico que se asocia a Mercurio en imágenes simples?', choices: ['Gris/plateado','Azul','Rojo','Verde'], correctIndex: 0 }
  ],
  Venus: [
    { id: 'v1', question: '¿Cuál es la atmósfera predominante en Venus?', choices: ['Dióxido de carbono','Oxígeno','Nitrógeno','Helio'], correctIndex: 0 },
    { id: 'v2', question: '¿Venus tiene lluvias líquidas como la Tierra?', choices: ['No (lluvia ácida de ácido sulfúrico)','Sí','Solo en el ecuador','Solo en polos'], correctIndex: 0 },
    { id: 'v3', question: '¿Cuántas lunas tiene Venus?', choices: ['0','1','2','3'], correctIndex: 0 },
    { id: 'v4', question: '¿Venus rota más lento o más rápido que la Tierra?', choices: ['Más lento','Más rápido','Igual','No rota'], correctIndex: 0 },
    { id: 'v5', question: '¿Venus tiene un efecto invernadero intenso?', choices: ['Sí','No','Solo localmente','Solo en verano'], correctIndex: 0 },
    { id: 'v6', question: '¿Venus tiene anillos?', choices: ['No','Sí','Temporalmente','Solo partículas'], correctIndex: 0 },
    { id: 'v7', question: '¿Cuál es la apariencia de Venus a simple vista desde la Tierra?', choices: ['Muy brillante','Oscuro','Rojo','Azul'], correctIndex: 0 },
    { id: 'v8', question: '¿Venus es más cercano en tamaño a la Tierra que Mercurio?', choices: ['Sí','No','Menos que Mercurio','Igual que Marte'], correctIndex: 0 },
    { id: 'v9', question: '¿Se han enviado misiones para aterrizar en Venus?', choices: ['Sí','No','Solo órbita','Solo sondas voladoras'], correctIndex: 0 },
    { id: 'v10', question: '¿Venus orbita más cerca que la Tierra?', choices: ['Sí','No','Igual distancia','Varía mucho'], correctIndex: 0 }
  ],
  Earth: [
    { id: 'e1', question: '¿Cuál es el único planeta conocido con vida?', choices: ['Tierra','Marte','Venus','Mercurio'], correctIndex: 0 },
    { id: 'e2', question: '¿Cuántas lunas tiene la Tierra?', choices: ['1','0','2','3'], correctIndex: 0 },
    { id: 'e3', question: '¿Cuál es el mayor componente de la atmósfera terrestre?', choices: ['Nitrógeno','Oxígeno','Dióxido de carbono','Argón'], correctIndex: 0 },
    { id: 'e4', question: '¿Qué porcentaje aproximado de la superficie terrestre está cubierta por agua?', choices: ['~71%','~50%','~25%','~90%'], correctIndex: 0 },
    { id: 'e5', question: '¿Cuál es el nombre de la capa de aire que protege la vida?', choices: ['Atmósfera','Manto','Corteza','Núcleo'], correctIndex: 0 },
    { id: 'e6', question: '¿La Tierra tiene un campo magnético que protege de la radiación solar?', choices: ['Sí','No','Solo en polos','Solo en el ecuador'], correctIndex: 0 },
    { id: 'e7', question: '¿En qué tipo de órbita se mueve la Tierra alrededor del Sol?', choices: ['Elíptica','Circular perfecta','Parabólica','Hipérbolica'], correctIndex: 0 },
    { id: 'e8', question: '¿Cuál es la edad aproximada de la Tierra?', choices: ['~4.5 mil millones de años','~1 millón de años','~1000 años','~10 mil años'], correctIndex: 0 },
    { id: 'e9', question: '¿Cuál es la principal causa de las estaciones en la Tierra?', choices: ['Inclinación del eje','Distancia al Sol','Actividad volcánica','Cambio del viento'], correctIndex: 0 },
    { id: 'e10', question: '¿Cuál es el satélite artificial natural de la Tierra?', choices: ['La Luna','El Sol','Marte','Venus'], correctIndex: 0 }
  ],
  Mars: [
    { id: 'ma1', question: '¿Cuál es el color comúnmente asociado a Marte?', choices: ['Rojo','Azul','Verde','Gris'], correctIndex: 0 },
    { id: 'ma2', question: '¿Marte tiene más, menos o ninguna luna comparado con la Tierra?', choices: ['Más o menos (2 pequeñas)','Menos','Misma cantidad','Cien lunas'], correctIndex: 0 },
    { id: 'ma3', question: '¿Marte tiene evidencia de agua en el pasado?', choices: ['Sí','No','Nunca','Solo hielo reciente'], correctIndex: 0 },
    { id: 'ma4', question: '¿Marte tiene estaciones como la Tierra?', choices: ['Sí','No','Solo un hemisferio','Solo en polos'], correctIndex: 0 },
    { id: 'ma5', question: '¿Cuál es el objeto geográfico más grande de Marte (volcán)?', choices: ['Olympus Mons','Everest','Valles Marineris','Mauna Kea'], correctIndex: 0 },
    { id: 'ma6', question: '¿Marte tiene un campo magnético global fuerte?', choices: ['No','Sí','Solo en el núcleo','Variable'], correctIndex: 0 },
    { id: 'ma7', question: '¿Marte es más pequeño que la Tierra?', choices: ['Sí','No','Igual','No se sabe'], correctIndex: 0 },
    { id: 'ma8', question: '¿Se han enviado rovers a Marte?', choices: ['Sí','No','Solo sondas orbitadoras','Solo telescopios'], correctIndex: 0 },
    { id: 'ma9', question: '¿Marte tiene anillos visibles?', choices: ['No','Sí','Solo por estaciones','Solo en exoplanetas'], correctIndex: 0 },
    { id: 'ma10', question: '¿Marte puede tener tormentas de polvo que cubren grandes áreas?', choices: ['Sí','No','Solo locales','Nunca'], correctIndex: 0 }
  ],
  Jupiter: [
    { id: 'j1', question: '¿Cuál es el planeta más grande del Sistema Solar?', choices: ['Júpiter','Saturno','Tierra','Neptuno'], correctIndex: 0 },
    { id: 'j2', question: '¿Júpiter es un planeta gaseoso?', choices: ['Sí','No','Rocoso','Iónico'], correctIndex: 0 },
    { id: 'j3', question: '¿Júpiter tiene un gran lugar en su atmósfera conocido como?', choices: ['La Gran Mancha Roja','El Ojo Azul','La Mancha Verde','El Gran Círculo'], correctIndex: 0 },
    { id: 'j4', question: '¿Júpiter tiene anillos visibles desde la Tierra?', choices: ['No visibles como Saturno','Sí claramente','No anillos','Solo en infrarrojo'], correctIndex: 0 },
    { id: 'j5', question: '¿Júpiter tiene muchas lunas?', choices: ['Sí (docenas)','No','Solo 1','Solo 2'], correctIndex: 0 },
    { id: 'j6', question: '¿Júpiter es principalmente hidrógeno y helio?', choices: ['Sí','No, es roca','Principalmente agua','Metales'], correctIndex: 0 },
    { id: 'j7', question: '¿Júpiter tiene una fuerte magnetosfera?', choices: ['Sí','No','Débil','Variable'], correctIndex: 0 },
    { id: 'j8', question: '¿Júpiter influyó en la formación del Sistema Solar por su masa?', choices: ['Sí','No','No se sabe','No influyó'], correctIndex: 0 },
    { id: 'j9', question: '¿Cómo se llaman algunas lunas famosas de Júpiter?', choices: ['Io, Europa, Ganimedes, Calisto','Fobos y Deimos','Titan y Encelado','Luna y Sol'], correctIndex: 0 },
    { id: 'j10', question: '¿Júpiter tiene una rápida rotación que causa achatamiento?', choices: ['Sí','No','Rotación lenta','No rota'], correctIndex: 0 }
  ],
  Saturn: [
    { id: 's1', question: '¿Cuál planeta es famoso por sus anillos?', choices: ['Saturno','Júpiter','Marte','Venus'], correctIndex: 0 },
    { id: 's2', question: '¿Los anillos de Saturno están hechos de?', choices: ['Hielo y roca','Gas','Plasma','Metal fundido'], correctIndex: 0 },
    { id: 's3', question: '¿Saturno es más grande que la Tierra?', choices: ['Sí','No','Igual','No se compara'], correctIndex: 0 },
    { id: 's4', question: '¿Saturno es un gigante gaseoso?', choices: ['Sí','No','Rocoso','Híbrido'], correctIndex: 0 },
    { id: 's5', question: '¿Saturno tiene muchas lunas?', choices: ['Sí','No','Solo 1','Solo 2'], correctIndex: 0 },
    { id: 's6', question: '¿Titan es una luna de Saturno?', choices: ['Sí','No','Luna de Júpiter','Planeta enano'], correctIndex: 0 },
    { id: 's7', question: '¿Saturno tiene una densidad menor que el agua?', choices: ['Sí (es menos denso que el agua)','No','La misma densidad','Varía mucho'], correctIndex: 0 },
    { id: 's8', question: '¿Saturno gira rápidamente sobre su eje?', choices: ['Sí','No','Extremadamente lento','No rota'], correctIndex: 0 },
    { id: 's9', question: '¿Los anillos de Saturno son permanentes?', choices: ['Pueden cambiar con el tiempo','Siempre iguales','Aparecen y desaparecen diariamente','No existen'], correctIndex: 0 },
    { id: 's10', question: '¿Saturno tiene un fuerte campo magnético?', choices: ['Sí','No','Débil','Desconocido'], correctIndex: 0 }
  ],
  Uranus: [
    { id: 'u1', question: '¿Urano tiene un eje muy inclinado?', choices: ['Sí (casi tumbado)','No','Levemente inclinado','No rota'], correctIndex: 0 },
    { id: 'u2', question: '¿Urano es un gigante helado?', choices: ['Sí','No, es rocoso','Gas gigante','Planeta enano'], correctIndex: 0 },
    { id: 'u3', question: '¿Urano tiene anillos?', choices: ['Sí','No','Solo en imágenes','No visibles'], correctIndex: 0 },
    { id: 'u4', question: '¿Urano es más frío que Júpiter?', choices: ['Sí','No','Igual temperatura','No se sabe'], correctIndex: 0 },
    { id: 'u5', question: '¿Urano tiene muchas lunas conocidas?', choices: ['Sí','No','Solo 1','Solo 2'], correctIndex: 0 },
    { id: 'u6', question: '¿Urano orbita más allá de Saturno?', choices: ['Sí','No','Antes de Marte','Entre Tierra y Marte'], correctIndex: 0 },
    { id: 'u7', question: '¿Urano fue descubierto con telescopio?', choices: ['Sí','No','Es visible a ojo','Fue descubierto por sonda'], correctIndex: 0 },
    { id: 'u8', question: '¿Urano tiene un color verdoso-azulado por su atmósfera?', choices: ['Sí','No','Rojo','Amarillo'], correctIndex: 0 },
    { id: 'u9', question: '¿Urano tiene una rápida rotación?', choices: ['Rota relativamente rápido','No rota','Gira muy lento','Gira solo en polos'], correctIndex: 0 },
    { id: 'u10', question: '¿Urano es más pequeño que Júpiter?', choices: ['Sí','No','Igual','Más grande'], correctIndex: 0 }
  ],
  Neptune: [
    { id: 'n1', question: '¿Neptuno es el planeta más lejano del Sistema Solar clásico?', choices: ['Sí','No','Plutón','Mercurio'], correctIndex: 0 },
    { id: 'n2', question: '¿Neptuno es conocido por vientos muy fuertes?', choices: ['Sí','No','Solo en tormentas pequeñas','No hay viento'], correctIndex: 0 },
    { id: 'n3', question: '¿Neptuno es un gigante helado?', choices: ['Sí','No, es rocoso','Gas gigante','Planeta enano'], correctIndex: 0 },
    { id: 'n4', question: '¿Neptuno tiene anillos tenues?', choices: ['Sí','No','Anillos muy brillantes','Anillos de polvo solo'], correctIndex: 0 },
    { id: 'n5', question: '¿Neptuno tiene lunas importantes como Tritón?', choices: ['Sí (Tritón)','No','Solo 1 pequeña','Solo partículas'], correctIndex: 0 },
    { id: 'n6', question: '¿Neptuno se encuentra más allá de Urano?', choices: ['Sí','No','Entre Saturno y Urano','Cerca de Júpiter'], correctIndex: 0 },
    { id: 'n7', question: '¿Neptuno tiene una apariencia azul intensa?', choices: ['Sí','No','Verde','Gris'], correctIndex: 0 },
    { id: 'n8', question: '¿Neptuno tiene tormentas visibles?', choices: ['Sí (ocasionalmente)','No','Siempre','Nunca'], correctIndex: 0 },
    { id: 'n9', question: '¿Se han enviado sondas a Neptuno directamente?', choices: ['Sí (Voyager 2)','No','Varias misiones','Solo telescopios'], correctIndex: 0 },
    { id: 'n10', question: '¿Neptuno es más masivo que la Tierra?', choices: ['Sí','No','Mismo tamaño','No se sabe'], correctIndex: 0 }
  ]
}
