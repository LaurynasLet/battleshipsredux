BOARD = {};

/**
* Pagrindinė funkcija nuo, kurios prasideda programos veikimas.
* Lentos dydis yra statinis = 8.
* Toliau einame į pačios lentelės generavimą.
*/
BOARD.initBoard = function (){
  var boardSize = 8;

  BOARD.generateBoard(boardSize);
}

/**
* Lentelės generavimas.
* @param boardSize lentelės dydis, statinis = 8
*/
BOARD.generateBoard = function(boardSize) {
  // Paimamas elementas su 'board-container' id ir jam priskiriami stiliai
  var boardContainer = document.getElementById('board-container');
  let boardContainerSize = boardSize * 50;
  boardContainer.style.width = boardContainerSize + 'px';

  // Ištryname visus vaikus priklausančius, boardContainer elementui
  BOARD.removeAllChildren(boardContainer);
  var log = document.getElementById('log-info');
  var iter = document.getElementById('iteration');
  var avg = document.getElementById('average');
  BOARD.turnSum = log.innerHTML;

  // Kviečiame laivų išdėstymo funkciją.
  // Kaip parametrą paduodame lentelės dydį boardSize
  var shipMap = BOARD.generateShips(boardSize);

  // Ciklas kuris lentos atitinkamus elementus nudažo pagal tame elemente esanti laivą
  for ( let i = 0; i < Math.pow(boardSize,2); i++){
    let boardElement = document.createElement('div');
    boardElement.className = 'board-element';
    boardElement.innerHTML = shipMap[i];
    switch (shipMap[i]) {
      case 1:
        boardElement.classList.add('one-ship');
        break;
      case 2:
        boardElement.classList.add('two-ship');
        break;
	case 3:
	 boardElement.classList.add('three-ship');
	 break;
	case 4:
	 boardElement.classList.add('four-ship');
	 break;
      default:

    }
    boardContainer.appendChild(boardElement);
  }

// Globalūs kintamieji

//Laiko kiek užtrunka vienas kompiuterio ėjimas nustatymas
BOARD.delayIncrement = 5;
BOARD.delay = 100;
//Ėjimų skaičiavimas
BOARD.turn = 0;
//Laivų kieko skaičius (tsum = dvigubas laivas, osum = viengubas, thsum = trigubas laivas, fsum = keturgubas laivas)
BOARD.tsum = 3;
BOARD.osum = 4;
BOARD.thsum = 2;
BOARD.fsum = 1;
//Skaitliukai, kurie skaičiuoja kokie laivai jau yra pašauti/nušauti
BOARD.ocounter = 0;
BOARD.tcounter = 0;
BOARD.thcounter = 0;
BOARD.fcounter = 0;
//Laivų lentelė priskiriame globaliam kintamajam
BOARD.shipMap = shipMap;

BOARD.preventInfinite = 0;
BOARD.iteration = iter.innerHTML;
BOARD.average = avg.innerHTML;
//Pradedamas AI darbas
BOARD.initAI(boardSize);

}
/**
* Generuojame AI žaidimo lentą
* param boardSize lentos dydis
*/
BOARD.generateAIBoard = function(boardSize){
  // Paimamas elementas su 'board-container' id ir jam priskiriami stiliai
  var boardContainer = document.getElementById('ai-board-container');
  let boardContainerSize = boardSize * 50;
  boardContainer.style.width = boardContainerSize + 'px';
 // Ištrynami visi vaikai priklausantys, boardContainer elementui
  BOARD.removeAllChildren(boardContainer);

 //Ciklas kuris kiekvienam atskiram elementui suteikia atskirą ID bei priskiria atitinkamas klases
  for ( let i = 0; i < Math.pow(boardSize,2); i++){
    let boardElement = document.createElement('div');
    boardElement.className = 'board-element';
    boardElement.id = i;
    boardElement.innerHTML = i;
    boardContainer.appendChild(boardElement);
  }
}

/**
* Funkcija tikrina ar duotas masyvas yra pilnas
* @param arr masyvas duotas tikrinimui
*/
BOARD.checkIfArrayIsFull = function (arr) {
  // Tikrinama ar yra bent vienas NULL elementas duotame masyve
  for(var i=0; i<arr.length; i++) {
    if(arr[i] == null) return false;
  }
  // Jeigu nėra NULL elementų gražinama TRUE
  return true;
}

/**
* Pradedamas AI darbas
* @param boardSize lentos dydis
*/
BOARD.initAI = function(boardSize) {
  // Mavyvas kuriame bus saugomi AI šūviai
  var shotMap = new Array(Math.pow(boardSize, 2));
  // Generuojame pirmą atsitiktinį šūvį
  var startIndex = BOARD.generateStartIndex(boardSize, shotMap);

 // Generuojame AI lentą
  BOARD.generateAIBoard(boardSize);
  // Galimi šūviai
  var possibleShots = [];
  // Pradedamas AI mąstymas
  BOARD.startAI(shotMap, boardSize, possibleShots);
}
/**
* Funkcija atsakinga už AI mąstymą ir gautų rezultatų apdorojimą
* @param shotMap AI šūvių lentelė
* @param boardSize Lentos dydis
* @param possibleShots Galimų šūvių masyvas
*/
BOARD.startAI = function(shotMap, boardSize, possibleShots){
  var shotIndex;
  console.log(possibleShots);

  // Tikrinama ar yra galimų šūvių
  if(possibleShots.length > 0)
  {
	  // Jeigu yra:
	  //Išrenkamas vienas atsitiktinis dydis ir jis yra naudojamas sekančiam šūviui
	  var random = Math.floor(Math.random() * possibleShots.length);
	  startIndex = possibleShots[random];
	  // Parinktas atsitiktinis šūvis yra išimamas iš galimų šūvių lentelės
	  possibleShots.splice(random, 1);
	  console.log("in possibleShots");
	  console.log(startIndex);
  }else{
	  // Jeigu ne:
	  // Tikriname ar žaidimas dar nesibaigė
	   if (BOARD.ocounter == BOARD.osum && BOARD.tcounter == (BOARD.tsum * 2) && BOARD.thcounter == (BOARD.thsum *3) && BOARD.fcounter == (BOARD.fsum * 4)) {
	   }else{
	  //Jeigu ne:
	  // Generuojamas naujas atsitiktinis šūvis = startIndex
	  console.log("GENERATING RANDOM");
	  startIndex = BOARD.generateStartIndex(boardSize, shotMap);
	  console.log("in random");
	  console.log(startIndex);
  	}
  }
  // Tikrinama ar shotMap masyvas yra pilnas
  var arrayIndex = BOARD.checkIfArrayIsFull(shotMap);

// Tikrinama ar žaidmas jau baigėsi
// Ar visi laivai jau yra nušauti arba shotMap masyvas jau yra pilnas
 if (BOARD.ocounter == BOARD.osum && BOARD.tcounter == (BOARD.tsum * 2) && BOARD.thcounter == (BOARD.thsum *3) && BOARD.fcounter == (BOARD.fsum * 4) ) {
	  console.log(BOARD.turn + " " + BOARD.ocounter + " " + BOARD.tcounter);
	 BOARD.endGame();
 }else if ( shotMap[startIndex] != null) {
	// Tikrinama ar nebuvo šauta į startIndex pasirinkimą
	//Jeigu taip:
	// Parenkamas naujas šūvis
 	BOARD.startAI(shotMap, boardSize, possibleShots);
}else {
    // Globalus ėjimų kintamas yra didamas kaskart patekus į šitą dalį
    BOARD.delay += BOARD.delayIncrement;
    BOARD.turn += 1;
    // Tikrinama šūvio rezultatai
    var shotResult = BOARD.takeTheShot(startIndex);
    // Jeigu rezultatas mažesnis negu 1
    if(shotResult < 1){
	// Įrašomas šūvis į AI šūvių lentelę
      shotMap[startIndex] = shotResult;

      //shotIndex = BOARD.generateStartIndex(boardSize);

	// Elementui kurio ID atitinka šūvį priskiriama 'missed' klasė
      document.getElementById(startIndex).classList.add('missed');

	// Po nustatyto laiko 'delay' yra vykdoma rekursija ir kviečiama ta pati startAI funkcija
      setTimeout(function(){BOARD.startAI(shotMap, boardSize, possibleShots);}, BOARD.delay);
	//BOARD.startAI(shotMap, boardSize, shotIndex);
    }else if (shotResult == 1) {
	    	BOARD.preventInfinite = 0;
      // Jeigu šūvis yra lygus 1 ( viengubas laivas)
	// Įrašomas šūvis į AI šūvių lentelę
      shotMap[startIndex] = shotResult;
      //shotIndex = BOARD.generateStartIndex(boardSize);

	// Elementui kurio ID atitinka šūvį priskiriama 'one-ship' klasė
      document.getElementById(startIndex).classList.add('one-ship');
	// Padidinamas pašautų viengubų laivų skaitliukas
	BOARD.ocounter += 1;
	// Po nustatyto laiko 'delay' yra vykdoma rekursija ir kviečiama ta pati startAI funkcija
      setTimeout(function(){BOARD.startAI(shotMap, boardSize, possibleShots);}, BOARD.delay);
	//BOARD.startAI(shotMap, boardSize, shotIndex);
    }else if (shotResult == 2) {
	    	BOARD.preventInfinite = 0;
	// Jeigu šūvis yra lygus 2 ( dvigubas laivas)
	// Padidinamas pašautų dvigubų laivų skaitliukas
	BOARD.tcounter += 1;
	// Įrašomas šūvis į AI šūvių lentelę
      shotMap[startIndex] = shotResult;

	// Tikrinama ar šalimai ( -1 ) esantis langelis yra tuščias ir ar jis nėra mažesnis negu 0
	// Ir
	// Ar šūvis nėra pirmas eilutėje
	// Ir
	// Tikrinama ar šalia gretimo langelio nėra laivo
      if ((startIndex-1 >= 0 ) && (startIndex % boardSize != 0) && (shotMap[startIndex-2] == 0 || shotMap[startIndex-2] == -1 || shotMap[startIndex-2] == null || (startIndex-1) % boardSize == 0)) {
		// Jeigu taip:
		// Tikriname aš gretimas langelis yra tuščias
		if(shotMap[startIndex-1] == 0 || shotMap[startIndex-1] == -1 || shotMap[startIndex-1] == null)
		{
			// Jeigu taip:
			// Gretimas langelis pridedamas į galimų šūvių lentelę possibleShots
			possibleShots.push(startIndex-1);
		}
      }

	// Tikrinama ar šalimai (+1) esantis langelis yra tuščias ir ar jis neviršija leistino dydžio
	// Ir
	// Ar šūvis nėra paskutinis eilutėje
	// Ir
	// Tikrinama ar šalia gretimo langelio nėra laivo
      if (startIndex+1 < Math.pow(boardSize, 2) && (shotMap[startIndex+2] == 0 || shotMap[startIndex+2] == null ||  (startIndex+1) % boardSize  == 7 || startIndex % boardSize == 0)) {
		// Jeigu taip:
		// Gretimas langelis pridedamas į galimų šūvių lentelę possibleShots
		if (shotMap[startIndex+1] == 0 || shotMap[startIndex+1] == -1 ||  shotMap[startIndex+1] == null) {
			possibleShots.push(startIndex+1);
		}
      }

	// Tikrinama ar šalimai (-8) esantis langelis yra tuščias ir ar jis nėra mažesnis negu 0
	// Ir
	// Tikrinama ar šalia gretimo langelio nėra laivo
      if (startIndex - boardSize >= 0 && (shotMap[startIndex - (boardSize * 2)] == 0 || shotMap[startIndex - (boardSize * 2)] == -1 || shotMap[startIndex-(boardSize * 2)] == null)) {
		// Jeigu taip:
		// Gretimas langelis pridedamas į galimų šūvių lentelę possibleShots
		if (shotMap[startIndex-boardSize] == 0 || shotMap[startIndex-boardSize] == -1 || shotMap[startIndex-boardSize] == null) {
			possibleShots.push(startIndex - boardSize);
		}
      }

	// Tikrinama ar šalimai (+8) esantis langelis yra tuščias ir ar jis nėra didesnis negu leistinas
	// Ir
	// Tikrinama ar šalia gretimo langelio nėra laivo
      if (+startIndex + +boardSize <  Math.pow(boardSize, 2) && (shotMap[+startIndex +(boardSize * 2)] == 0 || shotMap[+startIndex +(boardSize * 2)] == -1 || shotMap[+startIndex+(boardSize * 2)] == null)) {
		// Jeigu taip:
		// Gretimas langelis pridedamas į galimų šūvių lentelę possibleShots
		if (shotMap[+startIndex + +boardSize] == 0 || shotMap[+startIndex + +boardSize] == -1 || shotMap[+startIndex + +boardSize] == null) {
				possibleShots.push(+startIndex +  +boardSize);
		}
      }
	// Elementui kurio ID atitinka šūvį priskiriama 'two-ship' klasė
      document.getElementById(startIndex).classList.add('two-ship');

	// Tikrinama ar gretimai šūvio jau buvo pataikytą į dvigubą laivą
	if(shotMap[startIndex +1] == 2 || shotMap[startIndex -1] == 2 || shotMap[startIndex - boardSize] == 2 || shotMap[+startIndex + +boardSize] == 2)
	{
		// Jeigu taip:
		// Ištriname galimus šūvius
		possibleShots = [];
	}
	// Po nustatyto laiko 'delay' yra vykdoma rekursija ir kviečiama ta pati startAI funkcija
      setTimeout(function(){BOARD.startAI(shotMap, boardSize, possibleShots);}, BOARD.delay);
}else if (shotResult == 3) {
		BOARD.preventInfinite = 0;
	// Jeigu šūvis yra lygus 3 ( trigubas laivas)
	// Padidinamas pašautų trigubų laivų skaitliukas
	BOARD.thcounter += 1;

	// Įrašomas šūvis į AI šūvių lentelę
      shotMap[startIndex] = shotResult;

	// Elementui kurio ID atitinka šūvį priskiriama 'one-ship' klasė
	document.getElementById(startIndex).classList.add('three-ship');

	// Tikrinama ar šalimai ( -1 ) esantis langelis yra tuščias ir ar jis nėra mažesnis negu 0
	// Ir
	// Ar šūvis nėra pirmas eilutėje
	// Ir
	// Tikrinama ar šalia gretimo langelio nėra laivo
      if ((startIndex-1 >= 0 ) && (startIndex % boardSize != 0)&& (shotMap[startIndex-2] == 0 || shotMap[startIndex-2] == -1 || shotMap[startIndex-2] == null || shotMap[startIndex-2] == 3 || (startIndex-1) % boardSize == 0)) {
		// Jeigu taip:
		// Gretimas langelis pridedamas į galimų šūvių lentelę possibleShots
		if(shotMap[startIndex-1] == 0 || shotMap[startIndex-1] == -1 || shotMap[startIndex-1] == null)
		{
			possibleShots.push(startIndex-1);
		}
      }

	// Tikrinama ar šalimai ( +1 ) esantis langelis yra tuščias ir ar jis nėra didenis negu leistinas
	// Ir
	// Ar šūvis nėra pirmas eilutėje
	// Ir
	// Tikrinama ar šalia gretimo langelio nėra laivo
      if (startIndex+1 < (Math.pow(boardSize, 2)) && (shotMap[startIndex+2] == 0 || shotMap[startIndex+2] == -1|| (startIndex) % boardSize != 7 || shotMap[startIndex-2] == null || shotMap[startIndex-2] == 3 || (startIndex+1) % boardSize  == 7)) {
		// Jeigu taip:
		// Gretimas langelis pridedamas į galimų šūvių lentelę possibleShots
		if (shotMap[startIndex+1] == 0 || shotMap[startIndex+1] == -1 ||  shotMap[startIndex+1] == null) {
			possibleShots.push(startIndex+1);
		}
      }

	// Tikrinama ar šalimai ( -8 ) esantis langelis yra tuščias ir ar jis nėra didenis negu leistinas
	// Ir
	// Ar šūvis nėra pirmas eilutėje
	// Ir
	// Tikrinama ar šalia gretimo langelio nėra laivo
      if ((startIndex - boardSize) >= 0 && (shotMap[startIndex - (boardSize * 2)] == 0 || shotMap[startIndex - (boardSize * 2)] == -1 || shotMap[startIndex-(boardSize * 2)] == null || shotMap[startIndex-(boardSize * 2)] == 3)) {
		// Jeigu taip:
		// Gretimas langelis pridedamas į galimų šūvių lentelę possibleShots
		if (shotMap[startIndex-boardSize] == 0 || shotMap[startIndex-boardSize] == -1 || shotMap[startIndex-boardSize] == null) {
			possibleShots.push(startIndex - boardSize);
		}
      }

	// Tikrinama ar šalimai ( +8 ) esantis langelis yra tuščias ir ar jis nėra didenis negu leistinas
	// Ir
	// Ar šūvis nėra pirmas eilutėje
	// Ir
	// Tikrinama ar šalia gretimo langelio nėra laivo
      if ((+startIndex + +boardSize) <  Math.pow(boardSize, 2) && (shotMap[+startIndex +(boardSize * 2)] == 0 || shotMap[+startIndex +(boardSize * 2)] == -1 || shotMap[+startIndex+(boardSize * 2)] == null || shotMap[+startIndex+(boardSize * 2)] == 3)) {
		// Jeigu taip:
		// Gretimas langelis pridedamas į galimų šūvių lentelę possibleShots
		if (shotMap[+startIndex + +boardSize] == 0 || shotMap[+startIndex + +boardSize] == -1 || shotMap[+startIndex + +boardSize] == null) {
			possibleShots.push(+startIndex +  +boardSize);
		}
      }

	// Tikrinama ar gretimas ( +1 ) yra lygus 3 ( pašautam trigubui laivui)
	// Ir
	// Šūvis nėra pirmas arba paskutinis eilutėj
	if(shotMap[startIndex +1] == 3){
		possibleShots = [];
		if ((startIndex % boardSize) > 0) {
			possibleShots.push(startIndex -1);
		}

		if(startIndex + 2 < (Math.pow(boardSize, 2)) && ((startIndex + 1) % boardSize != 7) ) {
			possibleShots.push(startIndex + 2);
		}
	}

	// Tikrinama ar gretimas ( -1 ) yra lygus 3 ( pašautam trigubui laivui)
	// Ir
	// Šūvis nėra pirmas arba paskutinis eilutėj
	if(shotMap[startIndex -1] == 3 ){
		possibleShots = [];
		if (startIndex +1  <  (Math.pow(boardSize, 2)) && (startIndex % boardSize != 7)) {
			possibleShots.push(startIndex +1);
		}

		if (((startIndex -1) % boardSize) > 0) {
			possibleShots.push(startIndex -2);
		}
	}

	// Tikrinama ar gretimas ( +8 ) yra lygus 3 ( pašautam trigubui laivui)
	// Ir
	// Ar galimas šūvis yra ribose
	if(shotMap[+startIndex + +boardSize] == 3){
		possibleShots = [];
		if (startIndex - boardSize  > 0) {
			possibleShots.push(startIndex - boardSize);
		}

		if(+startIndex +  +(boardSize *2) < (Math.pow(boardSize, 2) -1)) {
			possibleShots.push(+startIndex + +(boardSize*2));
		}
	}

	// Tikrinama ar gretimas ( -8 ) yra lygus 3 ( pašautam trigubui laivui)
	// Ir
	// Ar galimas šūvis yra ribose
	if(shotMap[startIndex - boardSize] == 3){
		possibleShots = [];
		if ((+startIndex + +boardSize) <  (Math.pow(boardSize, 2) -1)) {
			possibleShots.push(+startIndex + +boardSize);
		}

		if (startIndex - (boardSize * 2) > 0) {
			possibleShots.push(startIndex - (boardSize * 2));
		}
	}

	// Tikrina šonus ar yra nušautų trigubų laivų
	if((shotMap[startIndex +1] == 3 &&  shotMap[startIndex -1] == 3 ) || (shotMap[startIndex -1] == 3 &&  shotMap[startIndex -2] == 3 ) || (shotMap[startIndex +1] == 3 &&  shotMap[startIndex +2] == 3 ))
	{
		possibleShots = [];
	}
	// Tikrina viršų ir apačią ar yra nušautų trigubų laivų
	if((shotMap[+startIndex + +boardSize] == 3 &&  shotMap[startIndex -boardSize] == 3 ) || (shotMap[startIndex - boardSize] == 3 &&  shotMap[startIndex - (boardSize*2)] == 3 ) || (shotMap[+startIndex + +boardSize] == 3 &&  shotMap[+startIndex + +(boardSize*2)] == 3 ))
	{
		possibleShots = [];
	}
	console.log("SHOT THREE");
	console.log(possibleShots);
	// Po nustatyto laiko 'delay' yra vykdoma rekursija ir kviečiama ta pati startAI funkcija
      setTimeout(function(){BOARD.startAI(shotMap, boardSize, possibleShots);}, BOARD.delay);
}else if (shotResult == 4) {
	BOARD.preventInfinite = 0;
	// Jeigu šūvis yra lygus 4 ( keturgubas laivas)
	// Padidinamas pašautų trigubų laivų skaitliukas
	BOARD.fcounter += 1;
	// Įrašomas šūvis į AI šūvių lentelę
      shotMap[startIndex] = shotResult;
	console.log("SHOT FOUR START");


	document.getElementById(startIndex).classList.add('four-ship');

	// Tikrinama ar šalimai ( -1 ) esantis langelis yra tuščias ir ar jis nėra mažesnis negu 0
	// Ir
	// Ar šūvis nėra pirmas eilutėje
	// Ir
	// Tikrinama ar šalia gretimo langelio nėra laivo
	if ((startIndex-1 >= 0 ) && (startIndex % boardSize != 0)&& (shotMap[startIndex-2] == 0 || shotMap[startIndex-2] == -1 || shotMap[startIndex-2] == null || shotMap[startIndex-2] == 4 || (startIndex-1) % boardSize == 0)) {
		// Jeigu taip:
		// Gretimas langelis pridedamas į galimų šūvių lentelę possibleShots
		if(shotMap[startIndex-1] == 0 || shotMap[startIndex-1] == -1 || shotMap[startIndex-1] == null)
		{
			possibleShots.push(startIndex-1);
		}
	}

	// Tikrinama ar šalimai ( +1 ) esantis langelis yra tuščias ir ar jis nėra didenis negu leistinas
	// Ir
	// Ar šūvis nėra pirmas eilutėje
	// Ir
	// Tikrinama ar šalia gretimo langelio nėra laivo
	if (startIndex+1 < (Math.pow(boardSize, 2)) && (shotMap[startIndex+2] == 0 || shotMap[startIndex+2] == -1|| shotMap[startIndex+2] == null || shotMap[startIndex+2] == 4 || (startIndex+1) % boardSize  == 7)) {
		// Jeigu taip:
		// Gretimas langelis pridedamas į galimų šūvių lentelę possibleShots
		if (shotMap[startIndex+1] == 0 || shotMap[startIndex+1] == -1 ||  shotMap[startIndex+1] == null) {
			possibleShots.push(startIndex+1);
		}
	}

	// Tikrinama ar šalimai ( -8 ) esantis langelis yra tuščias ir ar jis nėra didenis negu leistinas
	// Ir
	// Ar šūvis nėra pirmas eilutėje
	// Ir
	// Tikrinama ar šalia gretimo langelio nėra laivo
	if (startIndex - boardSize >= 0 && (shotMap[startIndex - (boardSize * 2)] == 0 || shotMap[startIndex - (boardSize * 2)] == -1 || shotMap[startIndex-(boardSize * 2)] == null || shotMap[startIndex-(boardSize * 2)] == 4)) {
		// Jeigu taip:
		// Gretimas langelis pridedamas į galimų šūvių lentelę possibleShots
		if (shotMap[startIndex-boardSize] == 0 || shotMap[startIndex-boardSize] == -1 || shotMap[startIndex-boardSize] == null) {
			possibleShots.push(startIndex - boardSize);
		}
	}

	// Tikrinama ar šalimai ( +8 ) esantis langelis yra tuščias ir ar jis nėra didenis negu leistinas
	// Ir
	// Ar šūvis nėra pirmas eilutėje
	// Ir
	// Tikrinama ar šalia gretimo langelio nėra laivo
	if (+startIndex + +boardSize <  Math.pow(boardSize, 2) && (shotMap[+startIndex +(boardSize * 2)] == 0 || shotMap[+startIndex +(boardSize * 2)] == -1 || shotMap[+startIndex+(boardSize * 2)] == null || shotMap[+startIndex+(boardSize * 2)] == 4)) {
		// Jeigu taip:
		// Gretimas langelis pridedamas į galimų šūvių lentelę possibleShots
		if (shotMap[+startIndex + +boardSize] == 0 || shotMap[+startIndex + +boardSize] == -1 || shotMap[+startIndex + +boardSize] == null) {
			possibleShots.push(+startIndex +  +boardSize);
		}
	}

		// Tikrinama ar gretimas ( +1 ) yra lygus 4 ( pašautam trigubui laivui)
		// Ir
		// Šūvis nėra pirmas arba paskutinis eilutėj
		if(shotMap[startIndex +1] == 4){
			possibleShots = [];
			if ((startIndex % boardSize) > 0) {
				possibleShots.push(startIndex -1);
			}

			if(startIndex + 2 < (Math.pow(boardSize, 2)) && ((startIndex + 1) % boardSize != 7) ) {
				possibleShots.push(startIndex + 2);
			}
		}

		// Tikrinama ar gretimas ( -1 ) yra lygus 4 ( pašautam trigubui laivui)
		// Ir
		// Šūvis nėra pirmas arba paskutinis eilutėj
		if(shotMap[startIndex -1] == 4 ){
			possibleShots = [];
			if (startIndex +1  <  (Math.pow(boardSize, 2)) && (startIndex % boardSize != 7)) {
				possibleShots.push(startIndex +1);
			}

			if (((startIndex -1) % boardSize) > 0) {
				possibleShots.push(startIndex -2);
			}
		}

		// Tikrinama ar gretimas ( +8 ) yra lygus 4 ( pašautam trigubui laivui)
		// Ir
		// Ar galimas šūvis yra ribose
		if(shotMap[+startIndex + +boardSize] == 4){
			possibleShots = [];
			if (startIndex - boardSize  > 0) {
				possibleShots.push(startIndex - boardSize);
			}

			if(+startIndex +  +(boardSize *2) < (Math.pow(boardSize, 2) -1)) {
				possibleShots.push(+startIndex + +(boardSize*2));
			}
		}

		// Tikrinama ar gretimas ( -8 ) yra lygus 4 ( pašautam trigubui laivui)
		// Ir
		// Ar galimas šūvis yra ribose
		if(shotMap[startIndex - boardSize] == 4){
			possibleShots = [];
			if ((+startIndex + +boardSize) <  (Math.pow(boardSize, 2) -1)) {
				possibleShots.push(+startIndex + +boardSize);
			}

			if (startIndex - (boardSize * 2) > 0) {
				possibleShots.push(startIndex - (boardSize * 2));
			}
		}


		// Tikrinama aš šalia yra du 4 ( keturgubo ) laivo tipo pašauti laukai
		if(shotMap[startIndex +2] == 4)
		{
			possibleShots = [];
			if((startIndex) % boardSize != 0){
				possibleShots.push(startIndex-1);
			}
			if ((startIndex+2 ) % boardSize != 7) {
				possibleShots.push(startIndex+3);
			}
		}

		if(shotMap[startIndex - 2] == 4)
		{
			possibleShots = [];
			if((startIndex) % boardSize != 7){
				possibleShots.push(startIndex+1);
			}
			if ((startIndex-2 ) % boardSize != 0) {
				possibleShots.push(startIndex-3);
			}
		}

		if(shotMap[+startIndex + +(boardSize * 2)] == 4)
		{
			possibleShots = [];
			if((startIndex - boardSize) >= 0){
				possibleShots.push(startIndex-boardSize);
			}
			if ((+startIndex+ +(boardSize * 3) ) < Math.pow(boardSize, 2)) {
				possibleShots.push(+startIndex+ +(boardSize * 3));
			}
		}

		if(shotMap[startIndex - (boardSize * 2)] == 4)
		{
			possibleShots = [];
			if((+startIndex + +boardSize) < Math.pow(boardSize, 2)){
				possibleShots.push(+startIndex+ +boardSize);
			}
			if ((startIndex - (boardSize * 3) ) >= 0) {
				possibleShots.push(startIndex -  (boardSize * 3));
			}
		}

		// Tikrinama ar keturgubas laivas yra nušautas
		if((shotMap[startIndex +1] == 4 &&  shotMap[startIndex + 2] == 4 && shotMap[startIndex +3] == 4) || (shotMap[startIndex -1] == 4 &&  shotMap[startIndex + 1] == 4 && shotMap[startIndex + 2] == 4) || (shotMap[startIndex -2] == 4 &&  shotMap[startIndex -1] == 4 && shotMap[startIndex +1] == 4) || (shotMap[startIndex - 1] == 4 &&  shotMap[startIndex - 2] == 4 && shotMap[startIndex -3] == 4)   )
		{
			possibleShots = [];
		}

		if((shotMap[+startIndex + +boardSize] == 4 &&  shotMap[+startIndex + +(boardSize*2)] == 4 && shotMap[+startIndex + +(boardSize * 3)] == 4) || (shotMap[startIndex - boardSize] == 4 &&  shotMap[startIndex + boardSize] == 4 && shotMap[+startIndex + +(boardSize * 2)] == 4) || (shotMap[startIndex - (boardSize*2)] == 4 &&  shotMap[startIndex - boardSize] == 4 && shotMap[+startIndex + +boardSize] == 4) || (shotMap[startIndex - boardSize] == 4 &&  shotMap[startIndex - (boardSize * 2)] == 4 && shotMap[startIndex - (boardSize * 3)] == 4)   )
		{
			possibleShots = [];
		}
	console.log("SHOT FOUR");
	console.log(possibleShots);
      setTimeout(function(){BOARD.startAI(shotMap, boardSize, possibleShots);}, BOARD.delay);
}
  }

}

/**
* Funkcija atsakinga už šūvio rezultatą
* @param shotIndex AI pasirinkas šūvis
*/
BOARD.takeTheShot = function(shotIndex) {
  return BOARD.shipMap[shotIndex];
}

/**
* Funkcija kuri generuoja atsitiktinius šūvius
* @param boardSize Lentos dydis
* @param shotMap AI padarytų šūvių lentelė
*/
BOARD.generateStartIndex = function(boardSize, shotMap) {
  var random =  Math.floor(Math.random() * Math.pow(boardSize,2));
  var i =  0
  //|| shotMap[+random + +boardSize +1]  > 0 || shotMap[+random + +boardSize -1]  > 0 || shotMap[+random - +boardSize +1]  > 0 || shotMap[+random - +boardSize -1]  > 0 || shotMap[+random + +boardSize] > 0 || shotMap[random - boardSize] > 0
 // Tikrinama ar dar nebuvo šauta į tą vietą
 // Ar
 // Šalia nėra gretimų laivų
  while(shotMap[random] != null ||  i < 10)
  {
			console.log('CREATING NEW RANDOM NUMBER ');
			i++;
			BOARD.preventInfinite = BOARD.preventInfinite + 1;
			random =  Math.floor(Math.random() * Math.pow(boardSize,2));
}
	if (Number(BOARD.preventInfinite) >= 200) {
		BOARD.extraEnd();
	}
	  return random;
}

BOARD.extraEnd = function() {
	console.log("gg");
}
/**
* Funkcija pasirenka vieną į 5 galimų laivų padėčių atsitiktinai
* @param boardSize Lentos dydis
*/
BOARD.generateShips = function(boardSize) {
  var shipMap = []
  if(boardSize == 8)
  {
    var random = Math.floor(Math.random() * 5) + 1;
    switch (random) {
    	case 1:
		shipMap = [
		2,2,0,1,0,0,0,0,
		0,0,0,0,0,0,0,0,
		4,4,4,4,0,0,0,0,
		0,0,0,2,2,0,0,0,
		1,0,2,0,1,0,0,0,
		0,0,2,0,0,0,3,0,
		0,0,0,0,0,1,3,0,
		3,3,3,0,0,0,3,0,
		];
    		break;
	case 2:
		shipMap = [
		0,1,2,2,0,0,0,1,
		0,0,0,0,0,0,0,0,
		4,0,0,0,0,0,0,3,
		4,2,2,0,0,0,0,3,
		4,0,0,2,0,0,0,3,
		4,0,0,2,0,0,0,0,
		3,3,3,0,0,0,0,0,
		1,0,0,0,0,0,0,1,
		];
    		break;
	case 3:
		shipMap = [
		4,4,4,4,2,3,3,3,
		0,0,0,0,2,0,0,0,
		1,0,1,0,0,0,0,1,
		0,0,0,0,0,3,0,0,
		0,0,0,1,0,3,0,0,
		0,0,0,0,0,3,0,0,
		0,0,2,0,0,0,0,0,
		0,0,2,2,2,0,0,0,
		];
    		break;
	case 4:
		shipMap = [
		4,0,0,0,0,0,0,0,
		4,0,0,0,0,1,0,0,
		4,0,0,0,0,1,0,0,
		4,0,0,0,2,2,0,0,
		0,0,0,0,0,0,0,2,
		0,3,3,3,0,0,0,2,
		0,0,1,0,0,0,0,0,
		3,3,3,2,2,0,0,1,
		];
		break;
	case 5:
		shipMap = [
		0,0,0,0,0,0,1,0,
		0,4,4,4,4,0,0,0,
		0,0,0,2,2,0,0,1,
		0,0,0,0,3,0,0,0,
		0,0,0,0,3,0,0,0,
		3,3,3,1,3,0,0,0,
		0,0,0,0,0,0,2,0,
		0,2,2,1,0,0,2,0,
		];
		break;
    	default:
		shipMap = [
		0,0,0,0,0,0,0,0,
		0,0,0,0,0,0,0,0,
		0,0,0,0,0,0,0,0,
		0,0,0,0,0,0,0,0,
		0,0,0,0,0,0,0,0,
		0,0,0,0,0,0,0,0,
		0,0,0,0,0,0,0,0,
		0,0,0,0,0,0,0,0,
		];

    }
  }
  return shipMap;
}

BOARD.endGame = function () {
	// Paimamas elementas su 'log-info' id ir jame įrašomas ėjimų skaičius
	var log = document.getElementById('log-info');
	BOARD.turnSum = Number(BOARD.turnSum) + Number(BOARD.turn);
	log.innerHTML = Number(BOARD.turnSum);
	var iter = document.getElementById('iteration');
	var avg = document.getElementById('average');
	BOARD.iteration = Number(BOARD.iteration) + 1;
	iter.innerHTML = Number(BOARD.iteration);
	console.log(Number(BOARD.turnSum) );
	console.log(Number(BOARD.iteration));
	var average = Number(BOARD.turnSum) / Number(BOARD.iteration);
		console.log(average);
	avg.innerHTML = Number(average);
	if(Number(BOARD.iteration < 50)){
		BOARD.initBoard();
	}
}

BOARD.removeAllChildren = function(parentNode) {
  while (parentNode.firstChild) {
  parentNode.removeChild(parentNode.firstChild);
  }
}
document.getElementById('generate').addEventListener('click', BOARD.initBoard);
