var CREDITS = 2;
var from = 1;
var to;
$("#upload-button").click(function(){$(".container").hide();});
$("#pdf-settings").hide();
document.getElementById("credit-value").innerHTML = CREDITS;

      function openslidemenu(){
          document.getElementById("slidemenu").style.width= '250px';
      }
      function closeslidemenu(){
          document.getElementById("slidemenu").style.width= '0px';
      }
if(CREDITS == 0){
  window.alert("Credits: "+ CREDITS + "\nInsufficient Credits");
  $("#upload-button").addClass("disabled");
}
var __FILE;
//UPLOAD PDF + PREVIEW
var __PDF_DOC,
__CURRENT_PAGE,
__TOTAL_PAGES,
__PAGE_RENDERING_IN_PROGRESS = 0,
__CANVAS = $('#pdf-canvas').get(0),
__CANVAS_CTX = __CANVAS.getContext('2d');
function showPDF(pdf_url) {
$("#pdf-loader").show();
PDFJS.getDocument({ url: pdf_url }).then(function(pdf_doc) {
  __PDF_DOC = pdf_doc;
  __TOTAL_PAGES = __PDF_DOC.numPages;
  document.getElementById("to").value = __TOTAL_PAGES;
  $("#pdf-loader").hide();
  $("#pdf-contents").show();
  $("#pdf-settings").show();
  $("#pdf-total-pages").text(__TOTAL_PAGES);
  showPage(1);
}).catch(function(error) {
  $("#pdf-loader").hide();
  $("#upload-button").show();
  alert(error.message);
});;
}
function showPage(page_no) {
__PAGE_RENDERING_IN_PROGRESS = 1;
__CURRENT_PAGE = page_no;
$("#pdf-next, #pdf-prev").attr('disabled', 'disabled');
$("#pdf-canvas").hide();
$("#page-loader").show();
$("#pdf-current-page").text(page_no);
__PDF_DOC.getPage(page_no).then(function(page) {
  var scale_required = __CANVAS.width / page.getViewport(1).width;
  var viewport = page.getViewport(scale_required);
  __CANVAS.height = viewport.height;
  var renderContext = {
    canvasContext: __CANVAS_CTX,
    viewport: viewport
  };
  page.render(renderContext).then(function() {
    __PAGE_RENDERING_IN_PROGRESS = 0;
    $("#pdf-next, #pdf-prev").removeAttr('disabled');
    $("#pdf-canvas").show();
    $("#page-loader").hide();
  });
});
}
$("#upload-button").on('click', function() {
$("#file-to-upload").trigger('click');
});
$("#file-to-upload").on('change', function() {

  if(['application/pdf'].indexOf($("#file-to-upload").get(0).files[0].type) == -1) {
      alert('Error : Not a PDF');
      return;
  }
$("#upload-button").hide();
__FILE = URL.createObjectURL($("#file-to-upload").get(0).files[0]);
showPDF(__FILE);
});
$("#pdf-prev").on('click', function() {
if(__CURRENT_PAGE != from)
  showPage(--__CURRENT_PAGE);
});
$("#pdf-next").on('click', function() {
if(__CURRENT_PAGE != to)
  showPage(++__CURRENT_PAGE);
});

$("#update").on('click', function(){
from = document.getElementById("from").value;
to = document.getElementById("to").value;
from = Number(from);
if(from < 1 || from > to)
{
  alert("FROM option should be between 1 and TO");
  from = 1;
}
if(to > __TOTAL_PAGES || to < from)
{
  alert("TO option should be from FROM and last page");
  to = __TOTAL_PAGES;
}
__CURRENT_PAGE = from;
showPage(from);
});
