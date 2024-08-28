function displayHands(last=false) {
    if (DATA.playerHand?.length) {
      let final = "";
      for (const card of DATA.playerHand) {
        final += `<img draggable="false" src="images/fronts/${card.suit}_${card.value}.svg" title="${card.toString()}">`;
      }
      document.getElementById("playerHand").innerHTML = final;
    }
    if (DATA.dealerHand?.length) {
      let final = "";
      for (const card of DATA.dealerHand) {
        final += (final.length>0 && !last)?`<img draggable="false" src="images/backs/red.svg"}">`:`<img draggable="false" src="images/fronts/${card.suit}_${card.value}.svg" title="${card.toString()}">`;
      }
      document.getElementById("dealerHand").innerHTML = final;
    }
    document.getElementById("textDisplay").innerHTML = "";
  }
  function displayEndGame(data) {
    displayHands(true);
    let final = "";
    if (data.resultAlt) {
      final += `<h2>${data.resultAlt=="push"?"Push":data.resultAlt=="player"?"Your first hand wins!":"Dealer beats your first hand"}</h2>`;
      final += `<p>${data.dealerBust?"Dealer busted!":data.playerBustAlt?"You busted":""}</p>`;
      final += `<h2>${data.result=="push"?"Push":data.result=="player"?"Your second hand wins!":"Dealer beats your second hand"}</h2>`;
      final += `<p>${data.dealerBust?"Dealer busted!":data.playerBust?"You busted":""}</p>`;
    } else {
      final += `<h2>${data.result=="push"?"Push":data.result=="player"?"You Win!":"Dealer Wins"}</h2>`;
      final += `<p>${data.dealerBust?"Dealer busted!":data.playerBust?"You busted":""}</p>`;
    }
    document.getElementById("textDisplay").innerHTML = final;
    document.getElementById("playerChips").innerHTML = DATA.playerChips;
    document.getElementById("gameButtons").style.display = "none";
    document.getElementById("newGameSpan").style.display = "inline-block";
  }