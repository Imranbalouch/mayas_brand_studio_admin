var urlquestion = params = new URLSearchParams(window.location.search);
var callback = '';
var page_id='';
if (urlquestion.has('callback')) {
    callback = getParams();//urlquestion.get('callback');
    callback = '';
}
if (urlquestion.has('I')) {
    page_id = urlquestion.get('I');
}
var btnsub = $("#btn_sub");
var imgload = $("#img_load");
var btnsubopt = $("#btnsubotp");
var dataip = "_";
var strkey = "";
// var ApiForm = 'https://digitalgraphiks.co.uk/demo/custom_ecommerce/public/api';
var ApiForm = 'http://localhost/v3-cms/server/public/api';
var apiUrl_View = window.location.origin
var timeout = 0;
var UserTimeZone = -(new Date().getTimezoneOffset() / 60);



// Array of background image URLs
const backgroundImages = [
    'assets/images/backgrounds/1.jpg',
    'assets/images/backgrounds/2.jpg',
    'assets/images/backgrounds/3.jpg',
    'assets/images/backgrounds/4.jpg',
    'assets/images/backgrounds/5.jpg',
    'assets/images/backgrounds/6.jpg',
    'assets/images/backgrounds/7.jpg',
    'assets/images/backgrounds/8.jpg',
    'assets/images/backgrounds/9.jpg',
    'assets/images/backgrounds/10.jpg'
];

// Function to set a random background image
function setRandomBackgroundImage() {
    const randomIndex = Math.floor(Math.random() * backgroundImages.length);
    const selectedImage = backgroundImages[randomIndex];
    //console.log(selectedImage);
    document.getElementById('backgroundDiv').style.backgroundImage = `url(${selectedImage})`;
}


$( document ).ready(function() {
    imgload.show();
    if (sessionStorage.getItem('accessToken') != null) { 
        window.location.assign('index.html');
    } 
//secure();
setRandomBackgroundImage();
const d = new Date();
let year = d.getFullYear(); 
var CMS_Title='DG CMS';
$('#cms_title').html(CMS_Title);
$('#cms_copyrights').html(`Copyright ${year} © ${CMS_Title}. Version <span class="fw-medium">1.0.0</span>`);
imgload.hide();
});
$("#PassHideShow").on("click", function(e){
    e.preventDefault();
    if($(this).find("img").attr("src") === $(this).find("img").attr("eyeSlash")) {
      $(this).parent().find("input").attr("type", "password")
      $(this).find("img").attr("src", $(this).find("img").attr("eye"));
    } else {
      $(this).parent().find("input").attr("type", "text")
      $(this).find("img").attr("src", $(this).find("img").attr("eyeSlash"));
    }
  }); 
  function clearconsole() 
  {  
    console.log(window.console);   
    if(window.console ) 
    {     
      console.clear();   
    } 
  } 
  function secure(){
     // Disable right-click context menu
     document.addEventListener('contextmenu', function(e) {
        e.preventDefault();
    });

    // Disable F12 key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && e.key === 'I')) {
            e.preventDefault();
        }
    });

    // Disable other shortcuts like Ctrl+Shift+I (for developer tools)
    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey && e.shiftKey && e.key === 'I') {
            e.preventDefault();
        }
    });

    // Disable other shortcuts like Ctrl+U (for view source)
    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey && e.key === 'u') {
            e.preventDefault();
        }
    });

    // Disable other shortcuts like Ctrl+Shift+J (for JavaScript console)
    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey && e.shiftKey && e.key === 'J') {
            e.preventDefault();
        }
    });

    // Disable other shortcuts like Ctrl+Shift+C (for element inspector)
    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey && e.shiftKey && e.key === 'C') {
            e.preventDefault();
        }
    });

    // Disable Ctrl+C (copy)
    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey && e.key === 'c') {
            e.preventDefault();
        }
    });

    // Disable Ctrl+X (cut)
    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey && e.key === 'x') {
            e.preventDefault();
        }
    });

    // Disable Ctrl+V (paste)
    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey && e.key === 'v') {
            e.preventDefault();
        }
    });


    // Disable selection
    document.addEventListener('selectstart', function(e) {
        e.preventDefault();
    });

   
    // Periodically check if Developer Tools is open
    detectDevTools(true);
  }
 // Detect if Developer Tools is open
    function detectDevTools(allow) { 
        let devtoolsOpen = false; 
        const threshold = 160; // Width/height threshold to detect DevTools
        const width = window.outerWidth - window.innerWidth > threshold;
        const height = window.outerHeight - window.innerHeight > threshold;
        devtoolsOpen = width || height;
        if (devtoolsOpen) { 
            document.body.innerHTML = '<h1>You are unable to get source</h1>';
        }
        setTimeout(detectDevTools, 100);
    }
   
    
    
     