import $ from "jquery";
import "@wokwi/elements";

$("#menu-toggle").click(function (e) {
  e.preventDefault();
  $("#wrapper").toggleClass("toggled");
});

function addSourceLineNumbers() {
  let prefix = "prefix",
    l = 1,
    result = this.innerHTML.replace(/\n/g, function () {
      l++;
      return "\n" + '<a class="line" name="' + prefix + l + '">' + l + "</a>";
    });
  this.innerHTML = '<a class="line" name="' + prefix + '0">1</a>' + result;
}

$("#demo, #demo2").each(addSourceLineNumbers);
