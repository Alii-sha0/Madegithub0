
const DEFAULT_CHARACTER = "Imagenes/Personaje/Personaje.png";

function defItem(idSuffix, cat, slot, name, src){
  return { id:'d-'+idSuffix, cat, slot, name, isDefault:true, src };
}

const DEFAULT_ITEMS = {
  shoes: [
    defItem('shoe1-l','shoes','shoe','Zapatillas (izq)', "Imagenes/Personaje/Zapatos/ZapatillaCeleste1.png"),
    defItem('shoe1-r','shoes','shoe','Zapatillas (der)', "Imagenes/Personaje/Zapatos/ZapatillaCeleste2.png"),
    defItem('shoe2-l','shoes','shoe','Zapatillas (izq)', "Imagenes/Personaje/Zapatos/ZapatillasBlancas1.png"),
    defItem('shoe2-r','shoes','shoe','Zapatillas (der)', "Imagenes/Personaje/Zapatos/ZapatillasBlancas2.png"),
    defItem('shoe3-l','shoes','shoe','Zapatillas (izq)',  "Imagenes/Personaje/Zapatos/ZapatillasNegras1.png"),
    defItem('shoe3-r','shoes','shoe','Zapatillas (der)',  "Imagenes/Personaje/Zapatos/ZapatillasNegras2.png"),
    defItem('shoe4-l','shoes','shoe','Zapato (izq)',  "Imagenes/Personaje/Zapatos/ZapatoCrema01.png"),
    defItem('shoe4-r','shoes','shoe','Zapato (der)',  "Imagenes/Personaje/Zapatos/ZapatoCrema02.png"),
    defItem('shoe5-l','shoes','shoe','Zapato (izq)',  "Imagenes/Personaje/Zapatos/ZapatosCrema1.png"),
    defItem('shoe5-r','shoes','shoe','Zapato (der)',  "Imagenes/Personaje/Zapatos/ZapatosCrema2.png"),
    defItem('shoe6-l','shoes','shoe','Zapato (izq)',  "Imagenes/Personaje/Zapatos/ZapatosNegros1.png"),
    defItem('shoe6-r','shoes','shoe','Zapato (der)',  "Imagenes/Personaje/Zapatos/ZapatosNegros2.png")

  ],
  dresses: [
    defItem('dress1','dresses','dress','Vestido de sol', "Imagenes/Personaje/Vestidos/VestidoAmarillo.png"),
    defItem('dress2','dresses','dress','Vestido crema',  "Imagenes/Personaje/Vestidos/VestidoCrema.png"),
    defItem('dress3','dresses','dress','Vestido azul',   "Imagenes/Personaje/Vestidos/VestidoCeleste.png"),
    defItem('dress4','dresses','dress','Vestido rosado', "Imagenes/Personaje/Vestidos/VestidoRosa.png"),
    defItem('dress5','dresses','dress','Vestido rojo', "Imagenes/Personaje/Vestidos/VestidoRojo-removebg-preview.png")
  ],
  tops: [
    defItem('top1','tops','top','Corset', "Imagenes/Personaje/Arriba/Corset.png"),
    defItem('top2','tops','top','Blusa',  "Imagenes/Personaje/Arriba/BlusaBlanca1.png"),
    defItem('top3','tops','top','Blusa',  "Imagenes/Personaje/Arriba/BlusaCrema.png"),
    defItem('top4','tops','top','Blusa',  "Imagenes/Personaje/Arriba/BlusaCrema1.png"),
    defItem('top5','tops','top','Blusa',  "Imagenes/Personaje/Arriba/BlusaCrema2.png"),
    defItem('top6','tops','top','Blusa',  "Imagenes/Personaje/Arriba/BlusaCrema3.png")
  ],
  bottoms: [
    defItem('bottom1','bottoms','bottom','Falda', "Imagenes/Personaje/Abajo/FaldaJean.png"),
    defItem('bottom2','bottoms','bottom','Falda larga', "Imagenes/Personaje/Abajo/FaldaLarga-removebg-preview.png"),
    defItem('bottom3','bottoms','bottom','Falda', "Imagenes/Personaje/Abajo/FalditaCrema.png"),
    defItem('bottom4','bottoms','bottom','Falda', "Imagenes/Personaje/Abajo/FalditaMarron.png"),
    defItem('bottom5','bottoms','bottom','Falda', "Imagenes/Personaje/Abajo/FladitaBlanca.png"),
    defItem('bottom6','bottoms','bottom','Pantalón', "Imagenes/Personaje/Abajo/PantalónCremaLargo-removebg-preview.png"),
    defItem('bottom7','bottoms','bottom','Pantalón', "Imagenes/Personaje/Abajo/PantalónLargo2-removebg-preview.png")
  ],
  accessories: [
    defItem('acc1','accessories','accessory','Lentes', "Imagenes/Personaje/Accesorios/Lentes.png"),
    defItem('acc2','accessories','accessory','Lentes', "Imagenes/Personaje/Accesorios/Lentes2.png"),
    defItem('acc3','accessories','accessory','Lentes', "Imagenes/Personaje/Accesorios/Lentes3.png"),
    defItem('acc4','accessories','accessory','Aretes', "Imagenes/Personaje/Accesorios/AretesAzules.png"),
    defItem('acc5','accessories','accessory','Aretes', "Imagenes/Personaje/Accesorios/AretesAzules1.png"),
    defItem('acc6','accessories','accessory','Aretes', "Imagenes/Personaje/Accesorios/AretesAzulesOscuro1.png"),
    defItem('acc7','accessories','accessory','Aretes', "Imagenes/Personaje/Accesorios/AretesAzulesOscuro2.png"),
    defItem('acc8','accessories','accessory','Aretes', "Imagenes/Personaje/Accesorios/AretesAzulOscuro1.png"),
    defItem('acc9','accessories','accessory','Aretes', "Imagenes/Personaje/Accesorios/AretesAzulOscuro2.png"),
    defItem('acc10','accessories','accessory','Aretes', "Imagenes/Personaje/Accesorios/AretesBlancos1.png"),
    defItem('acc11','accessories','accessory','Aretes', "Imagenes/Personaje/Accesorios/AretesBlancos2.png"),
    defItem('acc12','accessories','accessory','Aretes', "Imagenes/Personaje/Accesorios/AretesRojos1.png"),
    defItem('acc13','accessories','accessory','Aretes', "Imagenes/Personaje/Accesorios/AretesRojos2.png"),
    defItem('acc14','accessories','accessory','Aretes', "Imagenes/Personaje/Accesorios/AretesRosados1.png"),
    defItem('acc15','accessories','accessory','Aretes', "Imagenes/Personaje/Accesorios/AretesRosados2.png")
  ]
};