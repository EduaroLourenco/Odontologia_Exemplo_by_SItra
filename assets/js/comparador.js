/* Comparador antes/depois: um input range nativo (mouse, toque e teclado) move a divisória. */
(function () {
  "use strict";
  Array.prototype.forEach.call(document.querySelectorAll("[data-comparador]"), function (box) {
    var r = box.querySelector("input[type=range]");
    var aplicar = function () {
      box.style.setProperty("--pos", r.value + "%");
      r.setAttribute("aria-valuetext", r.value + "% mostrando antes, " + (100 - r.value) + "% mostrando depois");
    };
    r.addEventListener("input", aplicar);
    aplicar();
  });
})();
