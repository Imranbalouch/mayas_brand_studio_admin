var urlquestion = params = new URLSearchParams(window.location.search);
var _callback = '';
var _page_id='';
if (urlquestion.has('callback')) {
    _callback = getParams();//urlquestion.get('callback');
    _callback = '';
}
if (urlquestion.has('I')) {
    _page_id = urlquestion.get('I');
}
var btnsub = $("#btn_sub");
var imgload = $("#img_load");
var btnsubopt = $("#btnsubotp");
var dataip = "_";
var strkey = "";
var ApiForm = 'https://digitalgraphiks.co.uk/demo/custom_ecommerce/public/api';
var apiUrl_View = window.location.origin
var timeout = 0;
var _UserTimeZone = -(new Date().getTimezoneOffset() / 60);



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
   
    
    
    
//Login Start
async function Login() { 
    var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,10})+$/;
    var txt_nam = $("#txtusername");
    var txt_pwd = $("#txtuserpassword");
    var rcres = grecaptcha.getResponse();
    var divlog = $("#div_log");
    if (txt_nam.val().trim() == "") {
        $(txt_nam).focus(); 
        session_language == "AR" ?$("#ServerErrors").css("display","Block") :$("#ServerErrors").css("display","flex");
        $("#ServerErrors").html(session_language == "AR" ?  " <img src='assets/images/error.svg' /> الرجاء إدخال البريد الإلكتروني" : "<img src='assets/images/error.svg' /> Please enter email");        return false;
    } else if (!txt_nam.val().match(mailformat)) {
        $(txt_nam).focus(); 
        session_language == "AR" ?$("#ServerErrors").css("display","Block") :$("#ServerErrors").css("display","flex");
        $("#ServerErrors").html(session_language == "AR" ?  " <img src='assets/images/error.svg' /> بريد إلكتروني خاطئ" : "<img src='assets/images/error.svg' />Invalid email");
        return false;

    } else if (txt_pwd.val().trim() == "") {
        $(txt_pwd).focus();
        session_language == "AR" ?$("#ServerErrors").css("display","Block") :$("#ServerErrors").css("display","flex");
        $("#ServerErrors").html(session_language == "AR" ?  "<img src='assets/images/error.svg' />رمز مرور خاطئ" : " <img src='assets/images/error.svg' /> Invalid Password");
        return false;
    }

    else if (!rcres.length) {
        session_language == "AR" ?$("#ServerErrors").css("display","Block") :$("#ServerErrors").css("display","flex");
        $("#ServerErrors").html(session_language == "AR" ?  "<img src='assets/images/error.svg' /> الرجاء التحقق من reCAPTCHA" : " <img src='assets/images/error.svg' /> Please verify reCAPTCHA");
    return false; 
    }
    var dataip = "_"; 
    //checklogin();
    $.ajax({
        type: "POST",
        cache: false,
        url: ApiForm + '/login',
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify({ "email": txt_nam.val(), "password": txt_pwd.val(), "header": navigator.userAgent, "wanip": dataip }),
        beforeSend: function () {
            imgload.show();
            btnsub.hide(); 
        }, 
        success: function (response) {  
            imgload.hide();
            btnsub.show(); 
            if (response.status_code == 200) { 
                $("#txt_id").val(txt_nam.val()); 
                $("#otpModal").modal("show");
                startTimer();
             } else if (response.status_code == 401) {
             alert(response.status_code);
             session_language == "AR" ?$("#ServerErrors").css("display","Block") :session_language == "AR" ?$("#ServerErrors").css("display","Block") :$("#ServerErrors").css("display","flex");
                $("#ServerErrors").html(session_language == "AR" ?  "<img src='assets/images/error.svg' /> بيانات الاعتماد غير صحيحة. يرجى المحاولة مرة أخرى أو النقر على <a href='/ForgetPassword'>هل نسيت كلمة المرور؟</a> لإعادة تعيينها.": "<img src='assets/images/error.svg' />  Incorrect credentials. Please try again or click on <a href='/ForgetPassword'> Forgot Password</a> to reset.");
            }else if (response.status_code == 203) { 
                _title = response.message; 
                var _title = new Date(_title);
                _title1 = session_language == "AR" ? "الحساب مقفل حاول بعد" : 'Acount is locked, Try after ';
                _title = _title1 + moment(_title).format('h:mm A');
                session_language == "AR" ?$("#ServerErrors").css("display","Block") :$("#ServerErrors").css("display","flex");;
                $("#ServerErrors").html("<img src='assets/images/error.svg' />"+ _title); 
            }else if ( response.status_code == 403) {
                imgload.hide();
                btnsub.show();
                _title = response.message;
                session_language == "AR" ?$("#ServerErrors").css("display","Block") :$("#ServerErrors").css("display","flex");;
                $("#ServerErrors").html(session_language == "AR" ? "<img src='assets/images/error.svg' />الحساب غير نشط ":"<img src='assets/images/error.svg' /> Account is inactive.");
            }
        },
        error: function (xhr, status, err) {
            imgload.hide();
            btnsub.show();
            var _title = "";
            if (xhr.status.toString() == "0") 
            { 
                _title = session_language == "AR" ? "لم يتم العثور على الخادم" : "Server not found";
                session_language == "AR" ?$("#ServerErrors").css("display","Block") :$("#ServerErrors").css("display","flex");
                $("#ServerErrors").html(_title); 
            }
            else { _title = xhr.status.toString() + ' ' + err.toString(); }
             session_language == "AR" ?$("#ServerErrors").css("display","Block") :session_language == "AR" ?$("#ServerErrors").css("display","Block") :$("#ServerErrors").css("display","flex");
             $("#ServerErrors").html(_title);
        }
    }) 
    return true; 
}
//Login End


function startTimer() {
    ResendOTP(1,0);
} 
$("#txtusername").keyup(function (e) {
    if (e.keyCode === 13) {
        $("#txtuserpassword").focus();
    }
});
$("#txtuserpassword").keyup(function (e) {
    if (e.keyCode === 13) {
       // Login();
    }
});

function getParams(url = window.location) {
    // Create a params object
    let params = {};
    tt = ''; 
    new URL(url).searchParams.forEach(function (val, key) {
        if (params[key] !== undefined) { 
        } else {
            if (key == "callback") { tt = tt + key + "=" + val; } else { tt = tt + "&" + key + "=" + val; } 
        }
    });
    return tt.replace('callback=', ''); 
}
 
var otp = "";
function reGenerateSignIn() {
    ResendOTP(1,0);
    var Id = $("#txt_id").val();
    generateOTPSignIn(Id); 
}

function generateOTPSignIn(Id) {
    $.ajax({
        type: "Post",
        url: ApiForm+"/resend_otp",
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify({ "email": Id }),
        beforeSend: function (xhr) { 
            imgload.show();
        }, 
        success: function (response) {
            if (response.status_code == 200) {
                imgload.hide();
                otp = "Generated"; 
                $("#txt_otp-1").val('');
                $("#txt_otp-2").val('');
                $("#txt_otp-3").val('');
                $("#txt_otp-4").val('');
                $("#txt_otp-5").val('');
                $("#txt_otp-6").val('');
            }
            else if (response.status_code == 203) {
                imgload.hide();
                btnsubopt.show(); 
            }else {
                imgload.hide();
                btnsubopt.show();
                _title = response.message;

            }
        },
        error: function (xhr, status, err) {
            imgload.hide();
            btnsubopt.show(); 
        }
    })

}
let in1 = document.querySelector('#txt_otp-1'),
ins = document.querySelectorAll('input[type="number"].otp'),
splitNumber = function (e) {
  let data = e.data || e.target.value;
  if (!data) return;
  if (data.length === 1) return;

  popuNext(e.target, data);
},
popuNext = function (el, data) {
  el.value = data[0];
  data = data.substring(1);
  if (el.parentElement.nextElementSibling.querySelector('input') && data.length) {
    popuNext(el.parentElement.nextElementSibling.querySelector('input'), data);
  }
};

ins.forEach(function (input) {
input.addEventListener('keyup', function (e) {
  if (e.keyCode === 16 || e.keyCode == 9 || e.keyCode == 224 || e.keyCode == 18 || e.keyCode == 17) {
    return;
  }
  if ((e.keyCode === 8 || e.keyCode === 37) && this.parentElement.previousElementSibling !== null) {
    this.parentElement.previousElementSibling.querySelector('input').select();
  } else if (e.keyCode !== 8 && this.parentElement.nextElementSibling !== null) {
    this.parentElement.nextElementSibling.querySelector('input').select();
  }

  if (e.target.value.length > 1) {
    splitNumber(e);
  }
});

input.addEventListener('focus', function (e) {
  if (this === in1) return;

  if (in1.value == '') {
    in1.focus();
  }

  if (this.parentElement.previousElementSibling.querySelector('input').value == '') {
    this.parentElement.previousElementSibling.querySelector('input').focus();
  }
});
});

in1.addEventListener('input', splitNumber); 
$("#txt_otp-1 ,#txt_otp-2 ,#txt_otp-3,#txt_otp-4,#txt_otp-5,#txt_otp-6").on("keyup", function(){
    $(this).parent().parent().removeClass("error");
    $(this).parent().parent().find(".errorEl").html("");
  });
$("#txtusername, #txtusernamepassword , #txt_otp-1 ,#txt_otp-2 ,#txt_otp-3,#txt_otp-4,#txt_otp-5,#txt_otp-6").on("keyup", function(){
    $(this).parent().removeClass("error");
    $(this).parent().find(".errorEl").html("");
  });

$("#otpmodalform").on("submit", function (e) {
    var txt_nam = $("#txtusername").val(); 
    e.preventDefault();
    var _Otp1 = $("#txt_otp-1").val();
    var _Otp2 = $("#txt_otp-2").val();
    var _Otp3 = $("#txt_otp-3").val();
    var _Otp4 = $("#txt_otp-4").val();
    var _Otp5 = $("#txt_otp-5").val();
    var _Otp6 = $("#txt_otp-6").val(); 
    var txt_otp = _Otp1 + _Otp2 + _Otp3 + _Otp4 + _Otp5 + _Otp6; 
    var otp = txt_otp;
    if (otp.length > 0) {
        // If OTP is entered, clear the timeout
        clearTimeout(timeout);
    } 
    if (_Otp1 == "" || _Otp2 == "" || _Otp3 == "" || _Otp4 == "" || _Otp5 == "" || _Otp6 == "" ) {
        //console.log(_Otp1, _Otp2, _Otp3, _Otp4, _Otp5, _Otp6);
        $("#otpInput").addClass("error");
        $("#otpInput").next().html(session_language == "AR" ?  "<img src='assets/images/error.svg' />الرجاء إدخال كلمة المرور" : " <img src='assets/images/error.svg' />Please enter OTP");
        return false;
    }


    $.ajax({ 
        url: ApiForm+"/verify_otp",
        contentType: "application/json",
        type: "Post",
        cache: false,
        dataType: "json",
        data: JSON.stringify({ "otp": txt_otp, "email": txt_nam }),
        beforeSend: function (xhr) { 
            imgload.show();
            btnsubopt.hide();
        }, 
        success: function (response) { 
            if (response.status_code == 200) {
                console.log(response);
                sessionStorage.setItem('accessToken', response.accessToken);
                sessionStorage.setItem("Id", response.user["id"]);
                sessionStorage.setItem("FirstName", response.user["first_name"]);
                sessionStorage.setItem("LastName", response.user["last_name"]); 
                sessionStorage.setItem("Email", response.user["email"]);
                sessionStorage.setItem("Role_id", response.user["role_id"]);
                sessionStorage.setItem("PhoneNumber", response.user["phoneNumber"]);
                sessionStorage.setItem("PhotoUrl", response.user["photoUrl"]);
                imgload.hide();
                var _UrlView = _callback == '' ? 'index.html?M=dashboard' : _callback
                window.location.assign(_UrlView);
            }
            else if (response.status_code == 203) {
                imgload.hide();
                btnsubopt.show(); 
                _title = response.message; 
                var _title = new Date(_title); 
                _title1 = session_language == "AR" ? "<img src='assets/images/error.svg' />الحساب مقفل، حاول بعد" : "<img src='assets/images/error.svg' />Acount is locked, Try after ";
                _title = _title1 + moment(_title).format('h:mm A');
                $("#otpInput").addClass("error");
                $("#otpInput").next().html(_title); 
            }
            else if (response.status_code == 403) {
                imgload.hide();
                btnsubopt.show();
                _title = session_language == "AR" ? "<img src='assets/images/error.svg' /> OTP غير صالح " : "<img src='assets/images/error.svg' /> Invalid OTP";
                $("#otpInput").addClass("error");
                $("#otpInput").next().html(_title); 
            }
            else if (response.status_code == 403.5) {
                imgload.hide();
                btnsub.show();
                $("#otpInput").addClass("error");
                $("#otpInput").next().html(session_language == "AR" ? "<img src='assets/images/error.svg' />للأسف، تم قفل الحساب بسبب محاولات OTP غير صحيحة." : "<img src='assets/images/error.svg' /> Unfortunately, the account has been locked due to incorrect OTP attempts.");
            }
            else {
                imgload.hide();
                btnsubopt.show();
                _title = response.message; 
                session_language == "AR" ?$("#ServerErrors").css("display","Block") :$("#ServerErrors").css("display","flex");;
                $("#ServerErrors").html(_title); 
            }
        },
        error: function (xhr, status, err) {
            imgload.hide();
            btnsubopt.show();
            var _title = "";
            return;
        }
    })

    return true;
});

function ResendOTP(minutes, second){
    const givenTime = {min:minutes, sec: second};
    let sec = givenTime.sec;
    let min = givenTime.min;
    $("#resendOtp").text(`${min<10?"0"+min:min}:${sec<10?"0"+sec:sec}`);
    const interval = setInterval(() => {
      if(sec > 0) {
        sec--
      }
      if(sec === 0) {
        if(min === 0) {
          clearInterval(interval);
        } else {
          sec = 59;
          min--
        }
      }
var _Did = session_language == "AR" ? "لم تتلقها؟" :"Didn’t receive it? ";
      if(sec === 0 && min === 0) {
        $("#resendOtp").html(_Did +'<a href="javascript:void(0);" onClick="reGenerateSignIn()">  Resend OTP</a>');
      } else {
        $("#resendOtp").text(`${min<10?"0"+min:min}:${sec<10?"0"+sec:sec}`);
      }
    }, 1000);
        $("#otpModal").on('hidden.bs.modal', event => {
      clearInterval(interval);
  })
  }