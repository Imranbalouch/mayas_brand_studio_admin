// Cropper Variables
var image = document.getElementById('uploadedAvatar');
var cropBtn = document.getElementById('crop');
var cropper;
let CropBoxWidth = 100;
let CropBoxHeight = 100;
let fileNameCrop = "";
let inputCrop = "";
let fileSizeCrop;

$("#FileUploadSingle").on("change", function(e){
  e.preventDefault();
  let file = e.target.files[0];
  if (!file) {
    return;
  }
  $(this).parents(".form-group").removeClass("error");
  fileNameCrop = file.name
  CropBoxWidth = e.target.getAttribute("w");
  CropBoxHeight = e.target.getAttribute("h");
  inputCrop = e.target;

  const ExtArr = ["png", "jpg", "jpeg", "webp"];
  let fileName = file.name;
  fileSizeCrop = file.size;
  let fileExt = fileName.substring(fileName.lastIndexOf(".") + 1);
  let fileImage = URL.createObjectURL(file);

  if(!ExtArr.includes(fileExt)) {
    $(this).parents(".form-group").addClass("error");
    $(this).parents(".form-group").find(".error-txt").html("Extntion");
    e.target.value = "";
    return;
  }

  if (fileSizeCrop > 2000000) {
    $(this).parents(".form-group").addClass("error");
    $(this).parents(".form-group").find(".error-txt").html("File Size Must be less then 2mb");
    e.target.value = "";
    return;
  }

  var fileReader = new FileReader();

  fileReader.onload = function () {
    var img = new Image();
    img.src = fileReader.result;

    img.onload = function () {
      if (img.width >= parseInt(CropBoxWidth) || img.height >= parseInt(CropBoxHeight)) {
        var done = function (url) {
          image.src = url;
          $("#cropAvatarmodal").modal('show');
        };

        if (file) {
          var reader = new FileReader();
          reader.onload = function (e) {
            done(reader.result);
          };
          reader.readAsDataURL(file);
        }
        return;
      } else {
        $(inputCrop).parents(".form-group").find(".file-preview-imgs").html(`
          <div class="preview-card">
            <div class="img">
              <img src="${fileImage}" alt="">
              <span class="remove"><i class="fa-solid fa-x"></i></span>
            </div>
            <div class="card-info">
              <div class="card-name">${fileNameCrop.length >= 7 ? fileNameCrop.slice(0, 7).replace(/\.[^/.]+$/, "")+"... " : fileNameCrop.replace(/\.[^/.]+$/, "")}.${fileExt}</div>
              <div class="card-size">${calc_file_size(fileSizeCrop)}</div>
            </div>
          </div>
        `);
        
        $(inputCrop).parents(".form-group").find(".file-preview-imgs .preview-card .remove").on("click", function(e1){
          e1.preventDefault();
          $(this).parent().parent().remove();
          $(inputCrop).val("");
        });
      }
    };
  };
  fileReader.readAsDataURL(file);

});
 
$("#FileUploadSingle_add").on("change", function(e){
  e.preventDefault();
  let file = e.target.files[0];
  if (!file) {
    return;
  }
  $(this).parents(".form-group").removeClass("error");
  fileNameCrop = file.name
  CropBoxWidth = e.target.getAttribute("w");
  CropBoxHeight = e.target.getAttribute("h");
  inputCrop = e.target;

  const ExtArr = ["png", "jpg", "jpeg", "webp"];
  let fileName = file.name;
  fileSizeCrop = file.size;
  let fileExt = fileName.substring(fileName.lastIndexOf(".") + 1);
  let fileImage = URL.createObjectURL(file);

  if(!ExtArr.includes(fileExt)) {
    $(this).parents(".form-group").addClass("error");
    $(this).parents(".form-group").find(".error-txt").html("Extntion");
    e.target.value = "";
    return;
  }

  if (fileSizeCrop > 2000000) {
    $(this).parents(".form-group").addClass("error");
    $(this).parents(".form-group").find(".error-txt").html("File Size Must be less then 2mb");
    e.target.value = "";
    return;
  }

  var fileReader = new FileReader();

  fileReader.onload = function () {
    var img = new Image();
    img.src = fileReader.result;

    img.onload = function () {
      if (img.width >= parseInt(CropBoxWidth) || img.height >= parseInt(CropBoxHeight)) {
        var done = function (url) {
          image.src = url;
          $("#cropAvatarmodal").modal('show');
        };

        if (file) {
          var reader = new FileReader();
          reader.onload = function (e) {
            done(reader.result);
          };
          reader.readAsDataURL(file);
        }
        return;
      } else {
        $(inputCrop).parents(".form-group").find(".file-preview-imgs").html(`
          <div class="preview-card">
            <div class="img">
              <img src="${fileImage}" alt="">
              <span class="remove"><i class="fa-solid fa-x"></i></span>
            </div>
            <div class="card-info">
              <div class="card-name">${fileNameCrop.length >= 7 ? fileNameCrop.slice(0, 7).replace(/\.[^/.]+$/, "")+"... " : fileNameCrop.replace(/\.[^/.]+$/, "")}.${fileExt}</div>
              <div class="card-size">${calc_file_size(fileSizeCrop)}</div>
            </div>
          </div>
        `);
        
        $(inputCrop).parents(".form-group").find(".file-preview-imgs .preview-card .remove").on("click", function(e1){
          e1.preventDefault();
          $(this).parent().parent().remove();
          $(inputCrop).val("");
        });
      }
    };
  };
  fileReader.readAsDataURL(file);

});
 

// Cropper Js
$("#CancleCrop").on("click", function(){
  $(inputCrop).val("");
  $(inputCrop).parents(".form-group").find(".file-preview-imgs").html('');
});

function getCroppedCanvasFunctionSingle() {
  var canvas;
  $("#cropAvatarmodal").modal('hide');
  if (cropper) {
    canvas = cropper.getCroppedCanvas({
      width: CropBoxWidth,
      height: CropBoxHeight,
    });
    canvas.toBlob(function (blob) {
      var file = new File([blob], fileNameCrop, { type: 'image/png' });
      let container = new DataTransfer();
      container.items.add(file);

      var reader = new FileReader();
      reader.onload = function (event) {
        var imageData = event.target.result;
        let fileExt = fileNameCrop.substring(fileNameCrop.lastIndexOf(".") + 1);
        $(inputCrop).parents(".form-group").find(".file-preview-imgs").html(`
          <div class="preview-card">
            <div class="img">
              <img src="${imageData}" alt="">
              <span class="remove"><i class="fa-solid fa-x"></i></span>
            </div>
            <div class="card-info">
              <div class="card-name">${fileNameCrop.length >= 7 ? fileNameCrop.slice(0, 7).replace(/\.[^/.]+$/, "")+"... " : fileNameCrop.replace(/\.[^/.]+$/, "")}.${fileExt}</div>
              <div class="card-size">${calc_file_size(fileSizeCrop)}</div>
            </div>
          </div>
        `);
        
        $(inputCrop).parents(".form-group").find(".file-preview-imgs .preview-card .remove").on("click", function(e1){
          e1.preventDefault();
          $(this).parent().parent().remove();
          $(inputCrop).val("");
        });

      };
      reader.readAsDataURL(blob);

      inputCrop.files = container.files;
    }, 'image/png');
  }
}
$("#cropAvatarmodal").on('shown.bs.modal', function () {
  let minCropBoxWidth = CropBoxWidth;
  let minCropBoxHeight = CropBoxHeight;

  cropper = new Cropper(image, {
    viewMode: 2,
    aspectRatio: minCropBoxWidth / minCropBoxHeight, 
    autoCropArea: 0.1,
    zoomable: false,
    minCropBoxWidth: minCropBoxWidth,
    minCropBoxHeight: minCropBoxHeight,
    cropBoxResizable: false,
    dragMode: "move",
    movable: false
  });
}).on('hidden.bs.modal', function () {
  cropper.destroy();
  cropper.clear();
  cropper.reset();
  cropper = null;
});
 
if(cropBtn!= null){
cropBtn.addEventListener('click', function () {
  getCroppedCanvasFunctionSingle();
});
}

function calc_file_size(bytes) {
  if (bytes >= 1073741824) {
    bytes = Math.floor(bytes / 1073741824) + " GB";
  } else if (bytes >= 1048576) {
    bytes = Math.floor(bytes / 1048576) + " MB";
  } else if (bytes >= 1024) {
    bytes = Math.floor(bytes / 1024) + " KB";
  } else if (bytes > 1) {
    bytes = Math.floor(bytes) + " Bytes";
  } else if (bytes == 1) {
    bytes = Math.floor(bytes) + " Byte";
  } else {
    bytes = "0 bytes";
  }
  return bytes;
}