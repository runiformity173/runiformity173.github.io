function nameSort(e,t){let l=(e.level||0)+e.name,n=(t.level||0)+t.name;return l>n?1:l<n?-1:0}function fromName(e){return e.replaceAll("-"," ").replaceAll("%27","'")}function set2(e,t){setCookie(e,JSON.stringify(t))}function setCookie(e,t){var l="",n=new Date;n.setTime(n.getTime()+432e10),l="; expires="+n.toUTCString(),document.cookie=e+"="+(t||"")+l+"; path=/"}function getCookie(e){for(var t=e+"=",l=document.cookie.split(";"),n=0;n<l.length;n++){for(var o=l[n];" "==o.charAt(0);)o=o.substring(1,o.length);if(0==o.indexOf(t))return o.substring(t.length,o.length)}return null}function eraseCookie(e){document.cookie=e+"=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;"}function load(){if(window.location.href.includes("?")){let e=[];"You have no spellbooks yet."==document.getElementById("output").innerHTML&&(document.getElementById("output").innerHTML="");let t=JSON.parse(getCookie(window.location.href.split("?list=")[1])).sort(nameSort);for(let l in t)e.includes(t[l].level)||(e.push(t[l].level),document.getElementById("output").innerHTML+="<br>"+({0:"Cantrips",1:"1st-level",2:"2nd-level",3:"3rd-level",4:"4th-level",5:"5th-level",6:"6th-level",7:"7th-level",8:"8th-level",9:"9th-level"})[String(t[l].level)]+"<br>"),document.getElementById("output").innerHTML+="<a target='_blank' href='"+t[l].linkd+"'>"+t[l].name+"</a>&emsp;<span class='remove' onclick='removeSpell(\""+t[l].linkd+"\");'><p>‾</p></span><br>"}else for(let n of document.cookie.split(";"))!n.includes("_")&&n.includes("=")&&("You have no spellbooks yet."==document.getElementById("output").innerHTML&&(document.getElementById("output").innerHTML=""),document.getElementById("output").innerHTML+='<a target="_blank" href="https://dndspellsearch.ezhgamer173.repl.co/spell_list/?list='+n.split("=")[0].replace(" ","")+'">'+fromName(n.split("=")[0])+"</a><br>")}function removeSpell(e){console.log("ran");let t=e,l=JSON.parse(getCookie(window.location.href.split("?list=")[1])).sort(nameSort),n=[];for(let o in l)l[o].linkd!=t&&(console.log(l[o].linkd,t),n.push(l[o])),console.log(l[o]);setCookie(window.location.href.split("?list=")[1],JSON.stringify(n)),location.reload()}