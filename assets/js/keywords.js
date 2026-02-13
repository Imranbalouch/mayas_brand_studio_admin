 
const getTranslation = (key, lang) => {
  //console.log(lang); 
    lang= localStorage.getItem('lang');
    dir= localStorage.getItem('dir');
  if (TranslationData.length !== 0 && key) { 
      let found = TranslationData.find(item => item.key === key);  
      if (found) { 
          return found[lang] || found['EN'] || key;
      } else {
          return key;
      }
  } else {
      return key;
  }
}  
// Define a class for the custom element
class MyTranslation extends HTMLElement {
  constructor() {
    super();
    // Attach a shadow DOM
    this.attachShadow({ mode: 'open' });

    // Create an element to display dynamic content
    this.wrapper = document.createElement('span');
    this.shadowRoot.append(this.wrapper);

    // Set default language and get translation key from the element's content
    const translationKey = this.textContent.trim();  // Extract the key from inside the tag
    this.setLanguage('en', translationKey);
  }

  // Method to set language and update content
  setLanguage(lang, key) {
    const translatedText = getTranslation(key, lang);
    this.wrapper.textContent = translatedText;
  }

  // Lifecycle callback when the element is added to the DOM
  connectedCallback() {
   // console.log('Custom element added to page.');
  }

  // Lifecycle callback when the element is removed from the DOM
  disconnectedCallback() {
   // console.log('Custom element removed from page.');
  }
}

// Register the new custom element
customElements.define('g-t', MyTranslation);

function updateAllStaticValues(lang) {
  const translationElements = document.querySelectorAll('g-t');
  translationElements.forEach(element => {
    const translationKey = element.textContent.trim();  // Extract key again
    element.setLanguage(lang, translationKey);
  });
}
updateAllStaticValues();
var TranslationData = [
  {
    key: "btn_new",
    EN: "Add New",
    AR: "اضف جديد",
  },
  
  {
    key: "status_active",
    EN: "Active",
    AR: "",
  },
  {
    key: "status_inactive",
    EN: "Inactive",
    AR: "",
  },

  {
    key: "password",
    EN: "Password",
    AR: "password",
  },

  {
    key: "change_password",
    EN: "Change Password",
    AR: "Change Password",
  },

  {
    key: "show_password",
    EN: "Show Password",
    AR: "Show Password",
  },
  
  {
    key: "please_enter_valid_email",
    EN: "Please enter valid email",
    AR: "Please enter valid email",
  },
  {
    key: "select_area_to_crop",
    EN: "Select area to crop",
    AR: "Select area to crop",
  },
  

  {
    key: "record_added_sucessfully",
    EN: "Record added sucessfully",
    AR: "Record added sucessfully",
  },

  {
    key: "record_updated_sucessfully",
    EN: "Record updated sucessfully",
    AR: "Record updated sucessfully",
  },
  {
    key: "record_deleted_sucessfully",
    EN: "Record deleted sucessfully",
    AR: "Record deleted sucessfully",
  },
  
  {
    key: "delete",
    EN: "Delete",
    AR: "يمسح",
  },
  {
    key: "edit",
    EN: "Edit",
    AR: "يحرر",
  },
  {
    key: "modify_menu",
    EN: "Modify Menu",
    AR: "تدبير",
  },
  {
    key: "please_enter_name",
    EN: "Please Enter Name",
    AR: "رأي",
  },
  {
    key: "please_enter_parent_ul",
    EN: "Please enter parent ul",
    AR: "رأي",
  },
  {
    key: "please_enter_url",
    EN: "Please Enter URL",
    AR: "",
  },
  {
    key: "name",
    EN: "Name",
    AR: "متميز",
  },
  {
    key : "please_select_image",
    EN : "Please select image",
    AR : "حالة"
  },
  {
    key: "parent_id",
    EN: "Parent id",
    AR: "رأي",
  },
  {
    key: "sort_id",
    EN: "Sort id",
    AR: "أرسل للموافقة",
  },
  {
    key: "url",
    EN: "URL",
    AR: "اختار اللغة",
  },
  {
    key: "icon",
    EN: "Icon",
    AR: "الإنجليزية",
  },
  {
    key: "Arabic_lang",
    EN: "Arabic",
    AR: "عربى",
  },
  {
    key: "Email_label",
    EN: "Email ",
    AR: "البريد الإلكتروني",
  },
  {
    key: "add_new",
    EN: "Add New",
    AR: "موضوع البريد الإلكتروني",
  },
  {
    key: "admin_menus",
    EN: "Admin Menus",
    AR: "الإبلاغ عن البريد الإلكتروني للموظف",
  },
  {
    key: "administrator",
    EN: "Administrator",
    AR: "الإبلاغ عن البريد الإلكتروني للموظف",
  },
  {
    key: "all_menus",
    EN: "All Menus",
    AR: "التالي",
  },
  {
    key: "Table_View_previous",
    EN: "Previous",
    AR: "السابق",
  },
  {
    key: "editConfirmMsg",
    EN: "Are you sure you want to update?",
    AR: "هل أنت متأكد أنك تريد التحديث؟",
  },
  {
    key: "record_updated_sucessfully",
    EN: "Record Updated",
    AR: "",
  },
  {
    key: "choose_image",
    EN: "Choose Image",
    AR: "* اسم العرض",
  },
  {
    key: "active",
    EN: "Active",
    AR: "* الخادم",
  },
  {
    key: "search",
    EN: "Search",
    AR: "بحث",
  },
  {
    key: "status",
    EN: "Status",
    AR: "الحالة",
  },
  {
    key: "featured",
    EN: "Featured",
    AR: "",
  },
  {
    key: "searchFieldForDatatable",
    EN: "Search...",
    AR: "بحث",
  },
  {
    key: "all_languages",
    EN: "All Languages",
    AR: "بحث",
  },
  {
    key: "deleteConfirmMsg",
    EN: "Are you sure, you want to delete?",
    AR: "سعر",
  },
  {
    key: "code",
    EN: "Code",
    AR: "لقب",
  },
  {
    key: "modify_language",
    EN: "Modify Language",
    AR: "الفئة",
  },
  {
    key: "rtl",
    EN: "RTL",
    AR: "انشأ من قبل",
  },
  {
    key: "is_default",
    EN: "Default",
    AR: "تم التحديث بواسطة",
  },
  {
    key: "is_admin_default",
    EN: "Admin Default",
    AR: "الحالة",
  },
  {
    key: "first_name",
    EN: "First Name",
    AR: "محتوى",
  },
  {
    key: "last_name",
    EN: "Last Name",
    AR: "حضور",
  },
  {
    key: "email",
    EN: "Email",
    AR: "ماركس",
  },
  {
    key: "role",
    EN: "Role",
    AR: "معلم",
  },
  {
    key: "staff",
    EN: "Staffs",
    AR: "الموظفين",
  },
  {
    key: "modify_staff",
    EN: "Modify Staff",
    AR: "قسم",
  },
  {
    key: "all_staff",
    EN: "All Staff",
    AR: "معرف القسم",
  },
  {
    key: "Department_Name_lbl",
    EN: "Department Name",
    AR: "اسم القسم",
  },
  {
    key: "image",
    EN: "Image",
    AR: "اسم",
  },
  
  {  
    key: "please_enter_first_name",
    EN: "Please enter first name",
    AR: "متميز",
  },
  {
    key: "please_enter_last_name",
    EN: "Please enter last name",
    AR: "اسم االمستخدم",
  },
  {
    key: "please_enter_valid_email",
    EN: "Please enter valid email",
    AR: "* اسم االمستخدم",
  },
  {
    key: "addConfirmMsg",
    EN: "Are you sure you want to add?",
    AR: "* رمز الخدمة",
  },
  {
    key: "Role_th",
    EN: "Role",
    AR: "وظيفة",
  },
  {
    key: "Module_th",
    EN: "Module",
    AR: "وحدة",
  },
  {
    key: "Sorting_th",
    EN: "Sorting",
    AR: "فرز",
  },
  {
    key: "Prefix_th",
    EN: "Prefix",
    AR: "بادئة",
  },
  {
    key: "SpecialityCategoryName_EN",
    EN: "Speciality Category Name",
    AR: "اسم فئة التخصص",
  },
  {
    key: "rms_status_th",
    EN: "RMS Status",
    AR: "حالة RMS",
  },
  {
    key: "Speciality_th",
    EN: "Speciality",
    AR: "تخصص",
  },
  {
    key: "created_date",
    EN: "Created Date",
    AR: "تاريخ الإنشاء",
  },
  {
    key: "date_label",
    EN: "Date",
    AR: "تاريخ",
  },
  {
    key: "updated_date",
    EN: "Updated Date",
    AR: "تاريخ التحديث",
  },
  {
    key: "type_label",
    EN: "Type",
    AR: "يكتب",
  },
  {
    key: "due_date_label",
    EN: "Due Date",
    AR: "تاريخ الاستحقاق",
  },
  {
    key: "available_from_label",
    EN: "Available From",
    AR: "متاح من",
  },
  {
    key: "available_until_label",
    EN: "Available Until",
    AR: "متاح حتى",
  },
  {
    key: "percentage_label",
    EN: "Percentage",
    AR: "النسبة المئوية",
  },
  {
    key: "points_label",
    EN: "Points",
    AR: "نقاط",
  },
  {
    key: "assessment_type_label",
    EN: "Assessment Type",
    AR: "نوع التقييم",
  },
  {
    key: "passing_criteria_label",
    EN: "Passing Criteria",
    AR: "معايير النجاح",
  },
  {
    key: "active_lbl",
    EN: "Active",
    AR: "نشيط",
  },
  {
    key: "Status_lbl",
    EN: "Status",
    AR: "حالة",
  },
  {
    key: "inactive_lbl",
    EN: "Inactive",
    AR: "غير نشط",
  },
  {
    key: "Field_type_label",
    EN: "Field Type",
    AR: "نوع الحقل",
  },
  {
    key: "SenderId_label",
    EN: "Sender Id *",
    AR: "* هوية المرسل",
  },
  {
    key: "Application_Secret_label",
    EN: "Application Secret *",
    AR: "* سر التطبيق",
  },
  {
    key: "logout_label",
    EN: "Logout",
    AR: "تسجيل خروج",
  },
  {
    key: "login_label",
    EN: "Login",
    AR: "تسجيل الدخول",
  },
  {
    key: "editProfile_label",
    EN: "Edit Profile",
    AR: "يحرر",
  }, 
  {
    key: "total_label",
    EN: "Total Courses",
    AR: "مجموع الدورات",
  },
  {
    key: "active_label",
    EN: "Active Courses",
    AR: "الدورات النشطة",
  },
  {
    key: "inactive_label",
    EN: "Inactive Courses",
    AR: "الدورات التفاعلية",
  },
   
  {
    key: "featured_label",
    EN: "Featured",
    AR: "متميز",
  },
 
  {
    key: "start_date_label",
    EN: "Visible From",
    AR: "مرئي من",
  },
  {
    key: "end_date_label",
    EN: "Visible To",
    AR: "مرئي ل",
  },
  
  {
    key: "price_label",
    EN: "Price",
    AR: "السعر",
  },
  {
    key: "discount_type_label",
    EN: "Discount type",
    AR: "نوع الخصم",
  },
 
  
  {
    key: "tax_label",
    EN: "Tax",
    AR: "ضريبة",
  },
  
  {
    key: "lbl_discount",
    EN: "Discount Percentage",
    AR: "نسبة الخصم",
  },
  {
    key: "lbl_discount_amount",
    EN: "Discount Amount",
    AR: "مقدار الخصم",
  },
  {
    key: "configuration_heading",
    EN: "Configuration",
    AR: "ترتيب",
  },
  {
    key: "location_label",
    EN: "Location",
    AR: "موقعك",
  },
  {
    key: "category_label",
    EN: "Category",
    AR: "الفئة",
  },
  {
    key: "sub_category_label",
    EN: "Sub category",
    AR: "تصنيف فرعي",
  },
   
  {
    key: "level_label",
    EN: "Level",
    AR: "مستوى",
  },
  {
    key: "instructor_label",
    EN: "Instructor",
    AR: "معلم",
  },
  {
    key: "trainingSummaryHeading",
    EN: "Trainings Summary",
    AR: "ملخص التدريبات",
  },
  {
    key: "total_label_training",
    EN: "Total Trainings",
    AR: "إجمالي التدريبات",
  },
  {
    key: "active_label_training",
    EN: "Active Trainings",
    AR: "تدريبات نشطة",
  },
  {
    key: "inactive_label_training",
    EN: "Inactive Trainings",
    AR: "تدريبات غير نشطة",
  },
  {
    key: "id_th_training",
    EN: "Training ID",
    AR: "معرف التدريب",
  },
  {
    key: "title_th_training",
    EN: "Training Title",
    AR: "عنوان التدريب",
  },
  {
    key: "btn_sav",
    EN: "Save",
    AR: "حفظ",
  },
  {
    key: "btn_upd",
    EN: "Update",
    AR: "تحديث",
  },
  {
    key: "btn_cls",
    EN: "Close",
    AR: "أغلق",
  },
  {
    key: "programSummaryHeading",
    EN: "Programs Summary",
    AR: "ملخص البرامج",
  },
  {
    key: "total_label_program",
    EN: "Total Programs",
    AR: "إجمالي البرامج",
  },
  {
    key: "active_label_program",
    EN: "Active Programs",
    AR: "البرامج النشطة",
  },
  {
    key: "inactive_label_program",
    EN: "Inactive Programs",
    AR: "البرامج غير النشطة",
  },
  {
    key: "RequestSummaryHeading",
    EN: "Request Management Summary",
    AR: "طلب ملخص الإدارة",
  },
  {
    key: "Conference_Management_Summary_Heading",
    EN: "Conference Management Summary",
    AR: "ملخص إدارة المؤتمر",
  },
  {
    key: "Course_Management_Summary_Heading",
    EN: "Course Management Summary",
    AR: "ملخص إدارة الدورة",
  },
  {
    key: "Certificate_Management_Summary_Heading",
    EN: "Certificate Management Summary",
    AR: "ملخص إدارة الشهادة",
  },
  {
    key: "Instructor_Management_Summary_Heading",
    EN: "Instructor Management Summary",
    AR: "ملخص إدارة المدرب",
  },
  {
    key: "Program_Management_Summary_Heading",
    EN: "Program Management Summary",
    AR: "ملخص إدارة البرنامج",
  },
  {
    key: "Symposium_Management_Summary_Heading",
    EN: "Symposium Management Summary",
    AR: "ملخص إدارة الندوات",
  },
  {
    key: "Training_Management_Summary_Heading",
    EN: "Training Management Summary",
    AR: "ملخص إدارة التدريب",
  },
  {
    key: "Webinar_Management_Summary_Heading",
    EN: "Webinar Management Summary",
    AR: "ملخص إدارة الندوة عبر الإنترنت",
  },
  {
    key: "Workshop_Management_Summary_Heading",
    EN: "Workshop Management Summary",
    AR: "ملخص إدارة ورشة العمل",
  },
  {
    key: "total_label_rms",
    EN: "Total Requests",
    AR: "إجمالي الطلبات",
  },
  {
    key: "total_label_rms_assign",
    EN: "Total Responded",
    AR: "إجمالي الردود",
  },
  {
    key: "total_label_rms_un_assign",
    EN: "Total Non-Responded",
    AR: "إجمالي عدم الرد",
  },
  {
    key: "un_assign_label_rms1",
    EN: "Un-Assign",
    AR: "إلغاء التخصيص",
  },
  {
    key: "total_records_label",
    EN: "Total Records",
    AR: "إجمالي السجلات",
  },
  {
    key: "Approved_label_rms",
    EN: "Approved",
    AR: "وافق",
  },
  {
    key: "Approved_label_rms1",
    EN: "Approved",
    AR: "وافق",
  },
  {
    key: "financialApproved_label_rms",
    EN: "Financial Approved",
    AR: "تمت الموافقة المالية",
  },
  {
    key: "financialApproved_label_rms1",
    EN: "Financial Approved",
    AR: "تمت الموافقة المالية",
  },
  {
    key: "forwardedApproved_label_rms",
    EN: "Approved and forwarded to finance",
    AR: "تمت الموافقة عليها وتحويلها إلى التمويل",
  },
  {
    key: "forwardedApproved_label_rms1",
    EN: "Approved and forwarded to finance",
    AR: "تمت الموافقة عليها وتحويلها إلى التمويل",
  },
  {
    key: "Initial_label_rms",
    EN: "Initial Approval",
    AR: "موافقة مبدئية",
  },
  {
    key: "Initial_label_rms1",
    EN: "Initial Approval",
    AR: "موافقة مبدئية",
  },
  {
    key: "Pending_label_rms",
    EN: "Pending",
    AR: "قيد الانتظار",
  },
  {
    key: "Refusal_label_rms",
    EN: "Refusal",
    AR: "رفض",
  },
  {
    key: "Refusal_label_rms1",
    EN: "Refusal",
    AR: "رفض",
  },
  {
    key: "Additional_label_rms",
    EN: "Additional Information Required",
    AR: "مطلوب معلومات إضافية",
  },
  {
    key: "Additional_label_rms1",
    EN: "Additional Information Required",
    AR: "مطلوب معلومات إضافية",
  },
  {
    key: "Being_label_rms",
    EN: "Being Processed",
    AR: "يتم معالجتها",
  },
  {
    key: "Being_label_rms1",
    EN: "Being Processed",
    AR: "يتم معالجتها",
  },
  {
    key: "Inprogress_label_rms",
    EN: "In progress",
    AR: "في تَقَدم",
  },
  {
    key: "Inprogress_label_rms1",
    EN: "In progress",
    AR: "في تَقَدم",
  },
  {
    key: "Inactive_label_rms",
    EN: "In active",
    AR: "غير نشط",
  },
  {
    key: "Inactive_label_rms1",
    EN: "In active",
    AR: "غير نشط",
  },
  {
    key: "active_label_rms",
    EN: "Assigned",
    AR: "تعيين",
  },
  {
    key: "nav-home-tab",
    EN: "General Information",
    AR: "معلومات عامة",
  },
  {
    key: "nav-contact-tab",
    EN: "Activity Log",
    AR: "سجل النشاطات",
  },
  {
    key: "nav-contact-tab",
    EN: "Activity Log",
    AR: "سجل النشاطات",
  },
  {
    key: "rms_mark_approved",
    EN: "Mark as approved",
    AR: "وضع علامة على أنه تمت الموافقة عليه",
  },
  {
    key: "Course_Training_label",
    EN: "Course Training",
    AR: "دورة تدريبية",
  },
  {
    key: "Department_Name_label",
    EN: "Department Name",
    AR: "اسم القسم",
  },
  {
    key: "CheckListCategory_Name_label",
    EN: "Category Name",
    AR: "اسم التصنيف",
  },
  {
    key: "instructor_label",
    EN: "Instructor Label",
    AR: "مدرب",
  },
  {
    key: "id_th_symposiums",
    EN: "Symposium ID",
    AR: "معرف الندوة",
  },
  {
    key: "title_th_symposiums",
    EN: "Symposium Title",
    AR: "عنوان الندوة",
  },
  {
    key: "title",
    EN: "Title",
  },
  {
    key: "title",
    EN: "Title",
    AR: "عنوان",
  },
  {
    key: "slug",
    EN: "Slug",
    AR: "سبيكة",
  },
  {
    key: "description",
    EN: "Description",
    AR: "وصف",
  },
  {
    key: "image",
    EN: "Image",
    AR: "صورة",
  },
  {
    key: "ReqId_th",
    EN: "ID",
    AR: "بطاقة تعريف",
  },
  {
    key: "symposiumsSummaryHeading",
    EN: "Symposium Summary",
    AR: "ملخص الندوات",
  },
  {
    key: "total_label_symposiums",
    EN: "Total Symposium",
    AR: "إجمالي الندوات",
  },
  {
    key: "active_label_symposiums",
    EN: "Active Symposium",
    AR: "ندوات نشطة",
  },
  {
    key: "inactive_label_symposiums",
    EN: "Symposium Title",
    AR: "ندوات غير نشطة",
  },
  {
    key: "id_th_webinar",
    EN: "Webinar ID",
    AR: "معرف الويبينار",
  },
  {
    key: "title_th_webinar",
    EN: "Webinar Title",
    AR: "عنوان الندوة على الويب",
  },
  {
    key: "webinarSummaryHeading",
    EN: "Webinar Summary",
    AR: "ملخص البرنامج التعليمي على الويب",
  },
  {
    key: "total_label_webinar",
    EN: "Total Webinars",
    AR: "إجمالي الندوات عبر الإنترنت",
  },
  {
    key: "active_label_webinar",
    EN: "Active Webinars",
    AR: "ندوات عبر الإنترنت نشطة",
  },
  {
    key: "inactive_label_webinar",
    EN: "Inactive Webinars",
    AR: "ندوات عبر الإنترنت غير نشطة",
  },
  {
    key: "workshopSummaryHeading",
    EN: "Workshops Summary",
    AR: "ملخص ورش العمل",
  },
  {
    key: "total_label_workshop",
    EN: "Total Workshops",
    AR: "إجمالي ورش العمل",
  },
  {
    key: "active_label_workshop",
    EN: "Active Workshops",
    AR: "ورش عمل نشطة",
  },
  {
    key: "inactive_label_workshop",
    EN: "Inactive Workshops",
    AR: "ورش عمل غير نشطة",
  },
  {
    key: "id_th_workshop",
    EN: "Workshop ID",
    AR: "معرف ورش العمل",
  },
  {
    key: "title_th_workshop",
    EN: "Workshop Title",
    AR: "عنوان ورش العمل",
  },
  {
    key: "conferenceSummaryHeading",
    EN: "Confernces Summary",
    AR: "ملخص المؤتمرات",
  },
  {
    key: "total_label_conference",
    EN: "Total Confernces",
    AR: "إجمالي المؤتمرات",
  },
  {
    key: "active_label_conference",
    EN: "Active Confernces",
    AR: "المؤتمرات النشطة",
  },
  {
    key: "inactive_label_conference",
    EN: "Inactive Confernces",
    AR: "المؤتمرات غير النشطة",
  },
  {
    key: "id_th_conference",
    EN: "Confernce ID",
    AR: "معرف المؤتمر",
  },
  {
    key: "title_th_conference",
    EN: "Confernce Title",
    AR: "عنوان المؤتمر",
  },
  {
    key: "lms_user_label",
    EN: "LMS user",
    AR: "مستخدم LMS",
  },
  {
    key: "course_training_label",
    EN: "Course Training",
    AR: "دورة تدريبية",
  },
  {
    key: "gamification_label",
    EN: "Gamification",
    AR: "التلعيب",
  },
  {
    key: "icon_th",
    EN: "Icon",
    AR: "أيقونة",
  },
  {
    key: "record_type_th",
    EN: "Record type",
    AR: "نوع السجل",
  },
  {
    key: "point_th",
    EN: "Points",
    AR: "نقاط",
  },
  {
    key: "surveysSummaryHeading",
    EN: "Survey's summary",
    AR: "ملخص الاستطلاعات",
  },{
    key: "InstructorsurveysSummaryHeading",
    EN: "Instructor Survey's summary",
    AR: "ملخص الاستطلاعات",
  },
  {
    key: "total_label_surveys",
    EN: "Total Surveys",
    AR: "إجمالي الاستطلاعات",
  },
  {
    key: "active_label_surveys",
    EN: "Active Surveys",
    AR: "إجمالي الاستطلاعات",
  },
  {
    key: "inactive_label_surveys",
    EN: "Inactive Surveys",
    AR: "المسوحات غير النشطة",
  },
  {
    key: "assessmentsSummaryHeading",
    EN: "Assessments summary",
    AR: "ملخص الاستطلاعات",
  },
  {
    key: "total_label_assessments",
    EN: "Total Assessments",
    AR: "إجمالي التقييمات",
  },
  {
    key: "active_label_assessments",
    EN: "Active Assessments",
    AR: "التقييمات النشطة",
  },
  {
    key: "inactive_label_assessments",
    EN: "Inactive Assessments",
    AR: "التقييمات غير النشطة  ",
  },
  {
    key: "submission_attempts_label",
    EN: "Submission Attempts",
    AR: "محاولات التقديم",
  },
  {
    key: "number_of_attempts_label",
    EN: "Number of Attempts",
    AR: "عدد المحاولات",
  },
  {
    key: "attempts_label",
    EN: "Attempts",
    AR: "محاولات",
  },
  {
    key: "assesment_title_label",
    EN: "Assessment Title *",
    AR: "عنوان التقييم  *",
  },
  {
    key: "assessment_type_label",
    EN: "Assessment Type",
    AR: "نوع التقييم",
  },
  {
    key: "description_label",
    EN: "Description",
    AR: "وصف",
  },
  {
    key: "add_question_label",
    EN: "Add Question",
    AR: "أضف سؤال",
  },
  {
    key: "roles_permission_label",
    EN: "Roles Permission",
    AR: "إذن الأدوار",
  },
  {
    key: "role_name_label",
    EN: "Role Name",
    AR: "اسم الدور",
  },
  {
    key: "role_copy_label",
    EN: "Role Copy",
    AR: "نسخة الدور",
  },
  {
    key: "user_role_label",
    EN: "User Role",
    AR: "دور المستخدم",
  },
  {
    key: "profile_img_label",
    EN: "Profile Image",
    AR: "صورة الملف الشخصي",
  },
  {
    key: "change_password_label",
    EN: "Change Password",
    AR: "غير كلمة السر",
  },
  {
    key: "Special_Permissions_label",
    EN: "Special Permissions",
    AR: "أذونات خاصة",
  },
  {
    key: "send_blue_key",
    EN: "Send Blue Key",
    AR: "إرسال المفتاح الأزرق",
  },
  {
    key: "send_blue_url",
    EN: "Send Blue URL",
    AR: "إرسال URL أزرق",
  },
  {
    key: "approved&published_label",
    EN: "Approved & Published",
    AR: "تمت الموافقة عليها ونشرها",
  },
  {
    key: "approved&published_label",
    EN: "Initial Appr.",
    AR: "الموافقة المبدئية.",
  },
  {
    key: "approved&published_label",
    EN: "Being Proc.",
    AR: "يجري بروك.",
  },
  {
    key: "approved&published_label",
    EN: "Additional.",
    AR: "إضافي.",
  },
  {
    key: "approved&published_label",
    EN: "Application Assigned",
    AR: "تم تعيين التطبيق",
  },
  {
    key: "requestForApproval_label",
    EN: "Request For Approval",
    AR: "طلب موافقة",
  },
  {
    key: "RequestApproved_label_rms1",
    EN: "Request For Approval",
    AR: "طلب موافقة",
  },
  {
    key: "lms_user_lbl",
    EN: "LMS User",
    AR: "المستعمل LMS",
  },
  {
    key: "gamification_lbl",
    EN: "Gamification",
    AR: "التلعيب",
  },
  {
    key: "gamification_lbl",
    EN: "Gamification",
    AR: "التلعيب",
  },
  {
    key: "search_location_label",
    EN: "Search Location",
    AR: "موقع البحث",
  },
  {
    key: "search_categories_label",
    EN: "Search categories",
    AR: "فئات البحث",
  },
  {
    key: "search_apply_criteria_label",
    EN: "search apply criteria",
    AR: "البحث تطبيق المعايير",
  },
  {
    key: "search_department_label",
    EN: "search department",
    AR: "قسم البحث",
  },
  {
    key: "search_apply_assessment_label",
    EN: "search apply assessment",
    AR: "بحث تطبيق التقييم",
  },
  {
    key: "search_language_label",
    EN: "search language",
    AR: "لغة البحث",
  },
  {
    key: "search_level_label",
    EN: "search level",
    AR: "مستوى البحث",
  },
  {
    key: "search_instructor_label",
    EN: "search instructor",
    AR: "مدرب البحث",
  },
  {
    key: "amount_label",
    EN: "Amount",
    AR: "مقدار",
  },
  {
    key: "student_label",
    EN: "Student",
    AR: "طالب",
  },
  {
    key: "student_id",
    EN: "Student ID",
    AR: " هوية الطالب",
  },

  {
    key: "Assessment_Name_label",
    EN: "Assessment Name",
    AR: "اسم التقييم",
  },
  {
    key: "search_passing_type_label",
    EN: "search passing type",
    AR: "البحث عن نوع المرور",
  },
  {
    key: "search_passing_type_label",
    EN: "search assessment type",
    AR: " نوع تقييم البحث",
  },
  {
    key: "search_course_training_type_label",
    EN: "Search Course/Training Type",
    AR: " البحث عن الدورة التدريبية / نوع التدريب",
  },
  {
    key: "unlimited_label",
    EN: "Unlimited",
    AR: " غير محدود",
  },
  {
    key: "limited_label",
    EN: "Limited",
    AR: "محدود",
  },
  {
    key: "payment_label",
    EN: "Payment",
    AR: "قسط",
  },
  {
    key: "proceed_payment_label",
    EN: "Proceed Payment",
    AR: "متابعة الدفع",
  },
  {
    key: "forward_finance_label",
    EN: "Forward to Finance",
    AR: " إلى الأمام إلى التمويل",
  },
  {
    key: "course_label",
    EN: "Course",
    AR: "مسار",
  },
  {
    key: "symposiums_label",
    EN: "Symposium",
    AR: "ندوة",
  },
  {
    key: "webinar_label",
    EN: "Webinar",
    AR: "نقاش عبر الويب",
  },
  {
    key: "conference_label",
    EN: "conference",
    AR: "مؤتمر",
  },
  {
    key: "conference_label",
    EN: "conference",
    AR: "مؤتمر",
  },
  {
    key: "program_label",
    EN: "Program",
    AR: "برنامج",
  },
  {
    key: "training_label",
    EN: "Training",
    AR: "تمرين",
  },
  {
    key: "workshop_label",
    EN: "Workshop",
    AR: "ورشة عمل",
  },
  {
    key: "assign_label",
    EN: "Assign",
    AR: "تعيين",
  },
  {
    key: "assigntomanager_label",
    EN: "Assigned to manager",
    AR: "تم تعيينه للمدير",
  },
  {
    key: "inprogress_label",
    EN: "In-progress",
    AR: "في تَقَدم",
  },
  {
    key: "inprogress",
    EN: "Inprogress",
    AR: "في تَقَدم",
  },
  {
    key: "search_status_label",
    EN: "Search Status",
    AR: "حالة البحث",
  },
  {
    key: "survey_name_label",
    EN: "Survey Name *",
    AR: "اسم الاستطلاع *",
  },
  {
    key: "survey_type_label",
    EN: "Survey Type",
    AR: "نوع المسح",
  },
  {
    key: "survey_label",
    EN: "Survey",
    AR: "الدراسة الاستقصائية",
  },
  {
    key: "conference_approval_label",
    EN: "Conference Approval",
    AR: "موافقة المؤتمر",
  },
  {
    key: "course_approval_label",
    EN: "course approval",
    AR: "الموافقة على الدورة",
  },
  {
    key: "finance_approval_label",
    EN: "finance approval",
    AR: "الموافقة المالية",
  },
  {
    key: "instructor_approval_label",
    EN: "Instructor Approval",
    AR: "موافقة مدرس",
  },
  {
    key: "learner_approval_label",
    EN: "Learner Approval",
    AR: "موافقة المتعلم",
  },
  {
    key: "manager_approval_label",
    EN: "manager Approval",
    AR: "موافقة مدير",
  },
  {
    key: "symposiums_approval_label",
    EN: "symposiums Approval",
    AR: "الموافقة على الندوات",
  },
  {
    key: "symposiums_label",
    EN: "symposiums",
    AR: "ندوات",
  },
  {
    key: "webinar_approval_label",
    EN: "webinar Approval",
    AR: "الموافقة على الندوة عبر الإنترنت",
  },
  {
    key: "workshop_approval_label",
    EN: "workshop Approval",
    AR: "الموافقة على ورشة العمل",
  },
  {
    key: "training_approval_label",
    EN: "training Approval",
    AR: "الموافقة على التدريب",
  },
  {
    key: "program_approval_label",
    EN: "program Approval",
    AR: "الموافقة على البرنامج",
  },
  {
    key: "notification_summary_label",
    EN: "Notification Summary",
    AR: "ملخص الإخطار",
  },
  {
    key: "management_label",
    EN: "management",
    AR: "إدارة",
  },
  {
    key: "modules_label",
    EN: "Modules",
    AR: "الوحدات",
  },
  {
    key: "modules_label",
    EN: "Modules",
    AR: "الوحدات",
  },
  {
    key: "files_label",
    EN: "Files",
    AR: "الملفات",
  },
  {
    key: "resources_label",
    EN: "Resources",
    AR: "موارد",
  },
  {
    key: "faqs_label",
    EN: "faqs",
    AR: " الأسئلة الشائعة",
  },

  {
    key: "Assessment_Name_label",
    EN: "Assessment Name",
    AR: "اسم التقييم",
  },
  {
    key: "search_passing_type_label",
    EN: "search passing type",
    AR: "البحث عن نوع المرور",
  },
  {
    key: "search_passing_type_label",
    EN: "search assessment type",
    AR: " نوع تقييم البحث",
  },
  {
    key: "search_course_training_type_label",
    EN: "Search Course/Training Type",
    AR: " البحث عن الدورة التدريبية / نوع التدريب",
  },
  {
    key: "unlimited_label",
    EN: "Unlimited",
    AR: " غير محدود",
  },
  {
    key: "limited_label",
    EN: "Limited",
    AR: "محدود",
  },
  {
    key: "payment_label",
    EN: "Payment",
    AR: "قسط",
  },
  {
    key: "proceed_payment_label",
    EN: "Proceed Payment",
    AR: "متابعة الدفع",
  },
  {
    key: "forward_finance_label",
    EN: "Forward to Finance",
    AR: " إلى الأمام إلى التمويل",
  },
  {
    key: "course_label",
    EN: "Course",
    AR: "مسار",
  },
  {
    key: "symposiums_label",
    EN: "Symposium",
    AR: "ندوة",
  },
  {
    key: "webinar_label",
    EN: "Webinar",
    AR: "نقاش عبر الويب",
  },
  {
    key: "conference_label",
    EN: "conference",
    AR: "مؤتمر",
  },
  {
    key: "conference_label",
    EN: "conference",
    AR: "مؤتمر",
  },
  {
    key: "program_label",
    EN: "Program",
    AR: "برنامج",
  },
  {
    key: "training_label",
    EN: "Training",
    AR: "تمرين",
  },
  {
    key: "workshop_label",
    EN: "Workshop",
    AR: "ورشة عمل",
  },
  {
    key: "assign_label",
    EN: "Assign",
    AR: "تعيين",
  },
  {
    key: "assigntomanager_label",
    EN: "Assigned to manager",
    AR: "تم تعيينه للمدير",
  },
  {
    key: "inprogress_label",
    EN: "In-progress",
    AR: "في تَقَدم",
  },
  {
    key: "inprogress",
    EN: "Inprogress",
    AR: "في تَقَدم",
  },
  {
    key: "search_status_label",
    EN: "Search Status",
    AR: "حالة البحث",
  },
  {
    key: "survey_name_label",
    EN: "Survery Name",
    AR: "اسم الاستطلاع",
  },
  {
    key: "survey_type_label",
    EN: "Survey Type",
    AR: "نوع المسح",
  },
  {
    key: "survey_label",
    EN: "Survey",
    AR: "الدراسة الاستقصائية",
  },
  {
    key: "conference_approval_label",
    EN: "Conference Approval",
    AR: "موافقة المؤتمر",
  },
  {
    key: "course_approval_label",
    EN: "course approval",
    AR: "الموافقة على الدورة",
  },
  {
    key: "finance_approval_label",
    EN: "finance approval",
    AR: "الموافقة المالية",
  },
  {
    key: "instructor_approval_label",
    EN: "Instructor Approval",
    AR: "موافقة مدرس",
  },
  {
    key: "learner_approval_label",
    EN: "Learner Approval",
    AR: "موافقة المتعلم",
  },
  {
    key: "manager_approval_label",
    EN: "manager Approval",
    AR: "موافقة مدير",
  },
  {
    key: "symposiums_approval_label",
    EN: "symposiums Approval",
    AR: "الموافقة على الندوات",
  },
  {
    key: "symposiums_label",
    EN: "symposiums",
    AR: "ندوات",
  },
  {
    key: "webinar_approval_label",
    EN: "webinar Approval",
    AR: "الموافقة على الندوة عبر الإنترنت",
  },
  {
    key: "workshop_approval_label",
    EN: "workshop Approval",
    AR: "الموافقة على ورشة العمل",
  },
  {
    key: "training_approval_label",
    EN: "training Approval",
    AR: "الموافقة على التدريب",
  },
  {
    key: "program_approval_label",
    EN: "program Approval",
    AR: "الموافقة على البرنامج",
  },
  {
    key: "notification_summary_label",
    EN: "Notification Summary",
    AR: "ملخص الإخطار",
  },
  {
    key: "management_label",
    EN: "management",
    AR: "إدارة",
  },
  {
    key: "modules_label",
    EN: "Modules",
    AR: "الوحدات",
  },
  {
    key: "modules_label",
    EN: "Modules",
    AR: "الوحدات",
  },
  {
    key: "files_label",
    EN: "Files",
    AR: "الملفات",
  },
  {
    key: "resources_label",
    EN: "Resources",
    AR: "موارد",
  },
  {
    key: "faqs_label",
    EN: "faqs",
    AR: " الأسئلة الشائعة",
  },

  {
    key: "add_label",
    EN: "Add",
    AR: " الأسئلة الشائعة",
  },

  {
    key: "add_section_label",
    EN: "Add Module",
    AR: "إضافة وحدة",
  },

  {
    key: "add_file_label",
    EN: "Add File",
    AR: "اضف ملف",
  },

  {
    key: "add_resource_label",
    EN: "Add Resource",
    AR: " أضف المورد",
  },

  {
    key: "add_class_label",
    EN: "Add Class",
    AR: " إضافة فئة",
  },
  {
    key: "add_venue_label",
    EN: "Add Venue",
    AR: "أضف مكانًا",
  },
  {
    key: "add_price_label",
    EN: "Add Price",
    AR: " أضف السعر",
  },
  {
    key: "add_faq_label",
    EN: "Add FAQ",
    AR: " التعليمات",
  },

  {
    key: "action_label",
    EN: "action",
    AR: " عمل",
  },
  {
    key: "file_type_label",
    EN: "file type",
    AR: " نوع الملف",
  },
  {
    key: "accessibility_faq_label",
    EN: "Accessibility",
    AR: " إمكانية الوصول",
  },
  {
    key: "duration_label",
    EN: "Duration",
    AR: " المدة الزمنية",
  },
  {
    key: "classnameandlocation_label",
    EN: "class name and location",
    AR: " اسم الطبقة والموقع",
  },
  {
    key: "question_label",
    EN: "Question",
    AR: " سؤال",
  },
  {
    key: "answer_label",
    EN: "Answer",
    AR: " اسم إجابة",
  },
  {
    key: "Approved_th",
    EN: "Approved",
    AR: " موافقة",
  },
  {
    key: "manageclasses_label",
    EN: "Manage Classes",
    AR: " إدارة الفصول الدراسية",
  },
  {
    key: "manage_venues_label",
    EN: "Manage venues",
    AR: " إدارة الأماكن",
  },
  {
    key: "venues_label",
    EN: "Venues",
    AR: "مكان",
  },
  {
    key: "superadmin_label",
    EN: "superadmin",
    AR: "المشرف المتميز",
  },
  {
    key: "certificates_label",
    EN: "Certificates",
    AR: "الشهادات",
  },
  {
    key: "score_label",
    EN: "Score",
    AR: "نتيجة",
  },
  {
    key: "single_choice_label",
    EN: "Single Choice",
    AR: "خيار واحد",
  },
  {
    key: "multi_choice_label",
    EN: "Multiple Choice",
    AR: "متعدد الخيارات",
  },
  {
    key: "question-answer-label",
    EN: "Question/Answer",
    AR: "سؤال/إجابة",
  },
  {
    key: "question-answer-label",
    EN: "FileUpload",
    AR: " تحميل الملف",
  },
  {
    key: "add_another_opt_label",
    EN: "Add another Option",
    AR: " أضف خيارًا آخر",
  },
  {
    key: "answer_key_label",
    EN: "Answer key",
    AR: "مفتاح الإجابة",
  },
  {
    key: "acount_id_th",
    EN: "Account ID",
    AR: "معرف الحساب",
  },
  {
    key: "client_id_th",
    EN: "Client ID",
    AR: "معرف العميل",
  },
  {
    key: "domain_th",
    EN: "Domain",
    AR: "اِختِصاص",
  },
  {
    key: "AccountName_th",
    EN: "Account Name",
    AR: "إسم الحساب",
  },
  {
    key: "firstname_th",
    EN: "First Name",
    AR: "الاسم الأول",
  },
  {
    key: "lastname_th",
    EN: "Last Name",
    AR: "اسم العائلة",
  },
  {
    key: "guid_th",
    EN: "Guid",
    AR: "",
  },
  {
    key: "sid_th",
    EN: "Sid",
    AR: "",
  },
  {
    key: "InsertRecord_th",
    EN: "Insert Record",
    AR: "أسجل محدث",
  },
  {
    key: "UpdatedRecord_th",
    EN: "Updated Record",
    AR: "",
  },
  {
    key: "vat_th",
    EN: "VAT Number",
    AR: "ظريبه الشراء",
  },{
    key: "vat_th1",
    EN: "VAT Number",
    AR: "ظريبه الشراء",
  },      

  
  {
    key: "total_students",
    EN: "Total Students",
    AR: "مجموع الطلاب",
  },
  {
    key: "passed_students",
    EN: "Passed Students",
    AR: "الإشارات الخلوية",
  },
  {
    key: "failed_students",
    EN: "Failed Students",
    AR: "الإشارات الخلوية",
  },
  {
    key: "total_marks_label",
    EN: "Total Marks",
    AR: "مجموع علامات",
  },
  {
    key: "obtained_marks_label",
    EN: "Obtained Marks",
    AR: "الحصول على العلامات",
  },
  {
    key: "assessment_date_label",
    EN: "Assessment date",
    AR: "تاريخ التقييم",
  },
  {
    key: "attempted_date_label",
    EN: "Attempted date",
    AR: "تاريخ المحاولة",
  },
  {
    key: "fail_label",
    EN: "Fail",
    AR: "يفشل",
  },
  {
    key: "pass_label",
    EN: "Pass",
    AR: "يمر",
  },
  {
    key: "studentName_label",
    EN: "Student Name",
    AR: "أسم الطالب",
  },
  {
    key: "Assessmentsubmission_label",
    EN: "Assessment Submission",
    AR: "تقديم التقييم",
  },
  {
    key: "Incorrect_label",
    EN: "Incorrect",
    AR: "غير صحيح",
  },
  {
    key: "back_label",
    EN: "Back",
    AR: "خلف",
  },
  {
    key: "Certificates_Summary_label",
    EN: "Certificates Summary",
    AR: "ملخص الشهادات",
  },
  {
    key: "Total_Certificates_label",
    EN: "Total Certificates",
    AR: "إجمالي الشهادات",
  },
  {
    key: "certificate_name_label",
    EN: "Certificate Name",
    AR: "اسم الشهادة",
  },
  {
    key: "certificate_category",
    EN: "Certificate Category",
    AR: "فئة الشهادة",
  },
  {
    key: "sms_label",
    EN: "SMS",
    AR: " رسالة قصيرة",
  },
  {
    key: "notification_label",
    EN: "Notification",
    AR: " إشعار",
  },
  {
    key: "modify_label",
    EN: "Modify",
    AR: " يُعدِّل",
  },
  {
    key: "template_list",
    EN: "Template List",
    AR: " قائمة القوالب",
  },
  {
    key: "sms_template",
    EN: "SMS Templates",
    AR: "قوالب الرسائل القصيرة",
  },
  {
    key: "email_templates_label",
    EN: "Email Templates",
    AR: " قوالب البريد الإلكتروني",
  },
  {
    key: "All",
    EN: "All",
    AR: " الجميع",
  },
  {
    key: "disable_all",
    EN: "Disable All",
    AR: " أوقف عمل الكل",
  },
  {
    key: "enable_all",
    EN: "Enable All",
    AR: "تمكين الجميع",
  },
  {
    key: "notification_settings_label",
    EN: "Notification Setting",
    AR: "إعداد الإخطار",
  },
  {
    key: "user_assign_to",
    EN: "User Assigned To",
    AR: "المستخدم المعين إلى",
  },
  {
    key: "designation_label",
    EN: "Designation",
    AR: "تعيين",
  },
  {
    key: "displayName_th",
    EN: "Display Name",
    AR: "اسم العرض",
  },
  {
    key: "txt_designation",
    EN: "Designation",
    AR: "تعيين",
  },
  {
    key: "reportEmailOfficer",
    EN: "Report Officer Email",
    AR: "الإبلاغ عن البريد الإلكتروني للموظف",
  },
  {
    key: "Employee_Number_label",
    EN: "Employee Number",
    AR: "رقم الموظف",
  },
  {
    key: "txt_employee_number",
    EN: "Employee Number",
    AR: "رقم الموظف",
  },
  {
    key: "cancel_label",
    EN: "Cancel",
    AR: "يلغي",
  },
  {
    key: "sorting_id_label",
    EN: "Sorting ID",
    AR: "معرف الفرز",
  },
  {
    key: "order_label",
    EN: "Order",
    AR: "طلب",
  },
  {
    key: "duration_minutes_label",
    EN: "Duration (minutes)",
    AR: "المدة (بالدقائق)",
  },
  {
    key: "venue_date_label",
    EN: "Venue Date",
    AR: "تاريخ المكان",
  },
  {
    key: "Currency_th",
    EN: "Currency",
    AR: "عملة",
  },
  {
    key: "Symbol_th",
    EN: "Symbol",
    AR: "رمز",
  },
  {
    key: "timezone_lbl",
    EN: "Timezone",
    AR: "وحدة زمنية",
  },
  {
    key: "full_name_lbl",
    EN: "Full Name",
    AR: "الاسم الكامل",
  },
  {
    key: "flag_lbl",
    EN: "Flag",
    AR: "علَم",
  },
  {
    key: "googlemaps_lbl",
    EN: "GoogleMaps",
    AR: " خرائط جوجل",
  },
  {
    key: "openstreet_maps_lbl",
    EN: "OpenStreetMaps",
    AR: " افتح خرائط الشوارع",
  },
  {
    key: "cioc_lbl",
    EN: "CIOC",
    AR: " افتح خرائط الشوارع",
  },
  {
    key: "lat_lbl",
    EN: "Lat",
    AR: " خط العرض",
  },
  {
    key: "lang_lbl",
    EN: "Lang",
    AR: " خط الطول",
  },
  {
    key: "newsResource_label",
    EN: "News & Resources",
    AR: "الأخبار والموارد",
  },
  {
    key: "form_name_lbl",
    EN: "Form Name",
    AR: " اسم النموذج",
  },

  {
    key: "add_price_label",
    EN: "Add Price",
    AR: " أضف السعر",
  },
  {
    key: "add_faq_label",
    EN: "Add FAQ",
    AR: " التعليمات",
  },

  {
    key: "action_label",
    EN: "Action",
    AR: " عمل",
  },
  {
    key: "file_type_label",
    EN: "file type",
    AR: " نوع الملف",
  },
  {
    key: "accessibility_faq_label",
    EN: "Accessibility",
    AR: " إمكانية الوصول",
  },
  {
    key: "duration_label",
    EN: "Duration",
    AR: " المدة الزمنية",
  },
  {
    key: "classnameandlocation_label",
    EN: "class name and location",
    AR: " اسم الطبقة والموقع",
  },
  {
    key: "question_label",
    EN: "Question",
    AR: " سؤال",
  },
  {
    key: "answer_label",
    EN: "Answer",
    AR: " اسم إجابة",
  },
  {
    key: "Approved_th",
    EN: "Approved",
    AR: " موافقة",
  },
  {
    key: "manageclasses_label",
    EN: "Manage Classes",
    AR: " إدارة الفصول الدراسية",
  },
  {
    key: "manage_venues_label",
    EN: "Manage venues",
    AR: " إدارة الأماكن",
  },
  {
    key: "venues_label",
    EN: "Venues",
    AR: "مكان",
  },
  {
    key: "superadmin_label",
    EN: "superadmin",
    AR: "المشرف المتميز",
  },
  {
    key: "certificates_label",
    EN: "Certificates",
    AR: "الشهادات",
  },
  {
    key: "score_label",
    EN: "Score",
    AR: "نتيجة",
  },
  {
    key: "single_choice_label",
    EN: "Single Choice",
    AR: "خيار واحد",
  },
  {
    key: "multi_choice_label",
    EN: "Multiple Choice",
    AR: "متعدد الخيارات",
  },
  {
    key: "question-answer-label",
    EN: "Question/Answer",
    AR: "سؤال/إجابة",
  },
  {
    key: "question-answer-label",
    EN: "FileUpload",
    AR: " تحميل الملف",
  },
  {
    key: "add_another_opt_label",
    EN: "Add another Option",
    AR: " أضف خيارًا آخر",
  },
  {
    key: "answer_key_label",
    EN: "Answer key",
    AR: "مفتاح الإجابة",
  },
  {
    key: "total_students",
    EN: "Total Students",
    AR: "مجموع الطلاب",
  },
  {
    key: "passed_students",
    EN: "Passed Students",
    AR: "الإشارات الخلوية",
  },
  {
    key: "failed_students",
    EN: "Failed Students",
    AR: "الإشارات الخلوية",
  },
  {
    key: "total_marks_label",
    EN: "Total Marks",
    AR: "مجموع علامات",
  },
  {
    key: "obtained_marks_label",
    EN: "Obtained Marks",
    AR: "الحصول على العلامات",
  },
  {
    key: "assessment_date_label",
    EN: "Assessment date",
    AR: "تاريخ التقييم",
  },
  {
    key: "attempted_date_label",
    EN: "Attempted date",
    AR: "تاريخ المحاولة",
  },
  {
    key: "fail_label",
    EN: "Fail",
    AR: "يفشل",
  },
  {
    key: "pass_label",
    EN: "Pass",
    AR: "يمر",
  },
  {
    key: "studentName_label",
    EN: "Student Name",
    AR: "أسم الطالب",
  },
  {
    key: "Assessmentsubmission_label",
    EN: "Assessment Submission",
    AR: "تقديم التقييم",
  },
  {
    key: "Incorrect_label",
    EN: "Incorrect",
    AR: "غير صحيح",
  },
  {
    key: "back_label",
    EN: "Back",
    AR: "خلف",
  },
  {
    key: "Certificates_Summary_label",
    EN: "Certificates Summary",
    AR: "ملخص الشهادات",
  },
  {
    key: "Total_Certificates_label",
    EN: "Total Certificates",
    AR: "إجمالي الشهادات",
  },
  {
    key: "certificate_name_label",
    EN: "Certificate Name",
    AR: "اسم الشهادة",
  },
  {
    key: "certificate_category",
    EN: "Certificate Category",
    AR: "فئة الشهادة",
  },
  {
    key: "sms_label",
    EN: "SMS",
    AR: " رسالة قصيرة",
  },
  {
    key: "notification_label",
    EN: "Notification",
    AR: " إشعار",
  },
  {
    key: "modify_label",
    EN: "Modify",
    AR: " يُعدِّل",
  },
  {
    key: "template_list",
    EN: "Template List",
    AR: " قائمة القوالب",
  },
  {
    key: "email_templates_label",
    EN: "Email Templates",
    AR: " قوالب البريد الإلكتروني",
  },
  {
    key: "disable_all",
    EN: "Disable All",
    AR: " أوقف عمل الكل",
  },
  {
    key: "enable_all",
    EN: "Enable All",
    AR: "تمكين الجميع",
  },
  {
    key: "notification_settings_label",
    EN: "Notification Setting",
    AR: "إعداد الإخطار",
  },
  {
    key: "user_assign_to",
    EN: "User Assigned To",
    AR: "المستخدم المعين إلى",
  },
  {
    key: "designation_label",
    EN: "Designation",
    AR: "تعيين",
  },
  {
    key: "txt_designation",
    EN: "Designation",
    AR: "تعيين",
  },
  {
    key: "reportEmailOfficer",
    EN: "Report Officer Email",
    AR: "الإبلاغ عن البريد الإلكتروني للموظف",
  },
  {
    key: "Employee_Number_label",
    EN: "Employee Number",
    AR: "رقم الموظف",
  },
  {
    key: "txt_employee_number",
    EN: "Employee Number",
    AR: "رقم الموظف",
  },
  {
    key: "cancel_label",
    EN: "Cancel",
    AR: "يلغي",
  },
  {
    key: "sorting_id_label",
    EN: "Sorting ID",
    AR: "معرف الفرز",
  },
  {
    key: "order_label",
    EN: "Order",
    AR: "طلب",
  },
  {
    key: "duration_minutes_label",
    EN: "Duration (minutes)",
    AR: "المدة (بالدقائق)",
  },
  {
    key: "venue_date_label",
    EN: "Venue Date",
    AR: "تاريخ المكان",
  },
  {
    key: "Currency_th",
    EN: "Currency",
    AR: "عملة",
  },
  {
    key: "Symbol_th",
    EN: "Symbol",
    AR: "رمز",
  },
  {
    key: "timezone_lbl",
    EN: "Timezone",
    AR: "وحدة زمنية",
  },
  {
    key: "full_name_lbl",
    EN: "Full Name",
    AR: "الاسم الكامل",
  },
  {
    key: "flag_lbl",
    EN: "Flag",
    AR: "علَم",
  },
  {
    key: "googlemaps_lbl",
    EN: "GoogleMaps",
    AR: " خرائط جوجل",
  },
  {
    key: "openstreet_maps_lbl",
    EN: "OpenStreetMaps",
    AR: " افتح خرائط الشوارع",
  },
  {
    key: "cioc_lbl",
    EN: "CIOC",
    AR: " افتح خرائط الشوارع",
  },
  {
    key: "lat_lbl",
    EN: "Lat",
    AR: " خط العرض",
  },
  {
    key: "lang_lbl",
    EN: "Lang",
    AR: " خط الطول",
  },
  {
    key: "general_lbl",
    EN: "General",
    AR: "عام",
  },
  {
    key: "add_page_lbl",
    EN: "Add Page",
    AR: "إضافة صفحة",
  },
  {
    key: "secret_th",
    EN: "Api Secret",
    AR: "سر Api",
  },
  {
    key: "key_th",
    EN: "Api Key",
    AR: "مفتاح API",
  },
  {
    key: "email_th",
    EN: "Email",
    AR: "بريد إلكتروني",
  },
  {
    key: "secret_label",
    EN: "Api Secret *",
    AR: "سر API *",
  },
  {
    key: "key_label",
    EN: "Api Key *",
    AR: "مفتاح API *",
  },
  {
    key: "Notification_h",
    EN: "Notification",
    AR: "إشعار",
  },
  {
    key: "MarkRead_a",
    EN: "Mark all as read",
    AR: "اشر عليها بانها قرات",
  },
  {
    key: "ViewAll_a",
    EN: "View All",
    AR: "مشاهدة الكل",
  },
  {
    key: "server",
    EN: "Server",
    AR: "الخادم",
  },
  {
    key: "port",
    EN: "Port",
    AR: "ميناء",
  },
  {
    key: "username",
    EN: "User Name",
    AR: "اسم المستخدم",
  },
  {
    key: "username_th",
    EN: "User Name",
    AR: "اسم المستخدم",
  },
  {
    key: "userpassword",
    EN: "User Password",
    AR: "كلمة مرور المستخدم",
  },
  {
    key: "displayname",
    EN: "Display Name",
    AR: "اسم العرض",
  },
  {
    key: "sendbluekey",
    EN: "Send Blue Key",
    AR: "أرسل المفتاح الأزرق",
  },
  {
    key: "sendblueurl",
    EN: "Send Blue URL",
    AR: "إرسال URL أزرق",
  },
  {
    key: "name_label",
    EN: "Name",
    AR: "اسم",
  },
  {
    key: "name",
    EN: "Name",
    AR: "اسم",
  },
  {
    key: "comment_text",
    EN: "Comment",
    AR: "تعليق",
  },
  {
    key: "scholarship_approval",
    EN: "Scholarship Approval",
    AR: "الموافقة على المنحة",
  },
  {
    key: "UserType_th",
    EN: "User Type",
    AR: "نوع المستخدم",
  },
  {
    key: "DateTime_th",
    EN: "Date Time",
    AR: "تاريخ الوقت",
  },
  {
    key: "Time_th",
    EN: "Time",
    AR: "وقت",
  },
  {
    key: "Subject_th",
    EN: "Subject",
    AR: "موضوع",
  },
  {
    key: "Subject_R_label",
    EN: "Subject",
    AR: "موضوع",
  },
  {
    key: "date_label",
    EN: "Date Time",
    AR: "تاريخ الوقت",
  },
  {
    key: "message_label",
    EN: "Message",
    AR: "رسالة",
  },
  {
    key: "MasterCategory_th",
    EN: "Master Category",
    AR: "فئة رئيسية",
  },
  {
    key: "CourseName_th",
    EN: "Course Name",
    AR: "اسم الدورة التدريبية",
  },
  {
    key: "label_from",
    EN: "From",
    AR: "من",
  },
  {
    key: "label_to",
    EN: "To",
    AR: "ل",
  },
  {
    key: "h_Registration_Reports",
    EN: "Registration Reports",
    AR: "تقارير التسجيل",
  },
  {
    key: "h_Chart_Based_Reports",
    EN: "Chart Based Reports",
    AR: "التقارير القائمة على الرسم البياني",
  },
  {
    key: "totalRecord_th",
    EN: "Total Records",
    AR: "إجمالي السجلات",
  },
  {
    key: "Refused_th",
    EN: "Refused",
    AR: "رفض",
  },
  {
    key: "inprogress_th",
    EN: "Inprogress",
    AR: "في تَقَدم",
  },
  {
    key: "statustype_label",
    EN: "Status Type",
    AR: "نوع الحالة",
  },
  {
    key: "both_lbl",
    EN: "Both",
    AR: "كلاهما",
  },
  {
    key: "buttonText_th",
    EN: "Button Text",
    AR: "زر كتابة",
  },
  {
    key: "banner_image_label",
    EN: "Banner Image",
    AR: "صورة بانر",
  },
  {
    key: "Mobilebanner_image_label",
    EN: "Mobile Banner Image",
    AR: "صورة لافتة الهاتف المحمول",
  },
  {
    key: "Mobilebanner_image_label",
    EN: "Mobile Banner Image",
    AR: "صورة لافتة الهاتف المحمول",
  },
  {
    key: "backgroundColor_label",
    EN: "Background Color",
    AR: "لون الخلفية",
  },
  {
    key: "buttonColor_label",
    EN: "Button Color",
    AR: "لون الزر",
  },
  {
    key: "total_attempts",
    EN: "Total Attempts",
    AR: "مجموع محاولات",
  },
  {
    key: "passed_attempts",
    EN: "Passed Attempts",
    AR: "محاولات عابرة",
  },
  {
    key: "failed_attempts",
    EN: "Failed Attempts",
    AR: "محاولات فاشلة",
  },
  {
    key: "roleType_label",
    EN: "Role Type",
    AR: "نوع الدور",
  },
  {
    key: "sms_status_label",
    EN: "SMS",
    AR: "رسالة قصيرة",
  },
  {
    key: "editProfile_h",
    EN: "Edit Profile",
    AR: "تعديل الملف الشخصي",
  },
  {
    key: "old_Password",
    EN: "Old Password",
    AR: "كلمة المرور القديمة",
  },
  {
    key: "new_Password",
    EN: "New Password",
    AR: "كلمة المرور الجديدة",
  },
  {
    key: "confirm_Password",
    EN: "Confirm Password",
    AR: "تأكيد كلمة المرور",
  },
  {
    key: "changePassword_h",
    EN: "Change Password",
    AR: "تغيير كلمة المرور",
  },
  {
    key: "btn_upd_profile",
    EN: "Update Profile",
    AR: "تحديث الملف",
  },
  {
    key: "ApprovedPublished_label_rms",
    EN: "Approved & Published",
    AR: "تمت الموافقة عليها ونشرها",
  },
  {
    key: "ApprovedPublished_label_rms1",
    EN: "Approved & Published",
    AR: "تمت الموافقة عليها ونشرها",
  },
  {
    key: "ProceedPayment_label_rms",
    EN: "Proceed Payment",
    AR: "متابعة الدفع",
  },
  {
    key: "ProceedPayment_label_rms1",
    EN: "Proceed Payment",
    AR: "متابعة الدفع",
  },
  {
    key: "PaymentReceived_label_rms",
    EN: "Payment Received",
    AR: "تم استلام الدفعة",
  }, 
  {
    key: "PaymentReceived_label_rms1",
    EN: "Payment Received",
    AR: "تم استلام الدفعة",
  },
  {
    key: "card_declined_label_rms",
    EN: "Card Declined",
    AR: "بطاقة مرفوضة",
  },
  {
    key: "card_declined_label_rms1",
    EN: "Card Declined",
    AR: "بطاقة مرفوضة",
  },
  {
    key: "payment_refused_label_rms",
    EN: "Payment Refused",
    AR: "الدفع مرفوض",
  },
  {
    key: "payment_refused_label_rms1",
    EN: "Payment Refused",
    AR: "الدفع مرفوض",
  },
  {
    key: "Approved_forward_finance_RMS",
    EN: "Approved & Forwarded to Finance",
    AR: "تمت الموافقة عليها وإحالتها إلى قسم الشؤون المالية",
  },
  {
    key: "Approved_forward_finance_RMS1",
    EN: "Approved & Forwarded to Finance",
    AR: "تمت الموافقة عليها وإحالتها إلى قسم الشؤون المالية",
  },
  {
    key: "Service_th",
    EN: "Service Name",
    AR: "اسم الخدمة",
  },
  {
    key: "queryDetail_label",
    EN: "Query Detail",
    AR: "تفاصيل الاستعلام",
  },
  {
    key: "received_scholarship_label_rms",
    EN: "Received at the scholarship",
    AR: "حصل في المنحة",
  },
  {
    key: "received_scholarship_label_rms1",
    EN: "Received at the scholarship",
    AR: "حصل في المنحة",
  },
  {
    key: "assigned_label_rms",
    EN: "Responded",
    AR: "أجاب",
  },
  {
    key: "assigned_label_rms1",
    EN: "Assigned",
    AR: "مُكَلَّف",
  },
  {
    key: "received_application_label_rms",
    EN: "Received application complete",
    AR: "تم استلام الطلب",
  },
  {
    key: "received_application_label_rms1",
    EN: "Received application complete",
    AR: "تم استلام الطلب",
  },
  {
    key: "additional_documents_label_rms",
    EN: "Additional documents requested",
    AR: "المستندات الإضافية المطلوبة",
  },
  {
    key: "additional_documents_label_rms1",
    EN: "Additional documents requested",
    AR: "المستندات الإضافية المطلوبة",
  },
  {
    key: "pending_applicant_label_rms",
    EN: "Pending applicant department feedback",
    AR: "في انتظار ملاحظات قسم المتقدم",
  },
  {
    key: "pending_applicant_label_rms1",
    EN: "Pending applicant department feedback",
    AR: "في انتظار ملاحظات قسم المتقدم",
  },
  {
    key: "pending_credentialing_label_rms",
    EN: "Pending credentialing decision",
    AR: "في انتظار قرار الاعتماد",
  },
  {
    key: "pending_credentialing_label_rms1",
    EN: "Pending credentialing decision",
    AR: "في انتظار قرار الاعتماد",
  },
  {
    key: "pending_medical_label_rms",
    EN: "Pending Medical affairs / MOC decision",
    AR: "في انتظار الشؤون الطبية / قرار وزارة التجارة",
  },
  {
    key: "pending_medical_label_rms1",
    EN: "Pending Medical affairs / MOC decision",
    AR: "في انتظار الشؤون الطبية / قرار وزارة التجارة",
  },
  {
    key: "pending_cultural_label_rms",
    EN: "Pending feedback from cultural mission",
    AR: "التعليقات المعلقة من المهمة الثقافية",
  },
  {
    key: "pending_cultural_label_rms1",
    EN: "Pending feedback from cultural mission",
    AR: "التعليقات المعلقة من المهمة الثقافية",
  },
  {
    key: "pending_visa_label_rms",
    EN: "Pending visa",
    AR: "تأشيرة معلقة",
  },
  {
    key: "pending_visa_label_rms1",
    EN: "Pending visa",
    AR: "تأشيرة معلقة",
  },
  {
    key: "scheduled_stc_label_rms",
    EN: "Scheduled for STC",
    AR: "مجدول لشركة الاتصالات السعودية",
  },
  {
    key: "scheduled_stc_label_rms1",
    EN: "Scheduled for STC",
    AR: "مجدول لشركة الاتصالات السعودية",
  },
  {
    key: "stc_decision_label_rms",
    EN: "STC decision complete",
    AR: "قرار شركة الاتصالات السعودية مكتمل",
  },
  {
    key: "stc_decision_label_rms1",
    EN: "STC decision complete",
    AR: "قرار شركة الاتصالات السعودية مكتمل",
  },
  {
    key: "scheduled_etsc_label_rms",
    EN: "Scheduled for ETSC",
    AR: "مجدولة لـ ETSC",
  },
  {
    key: "scheduled_etsc_label_rms1",
    EN: "Scheduled for ETSC",
    AR: "مجدولة لـ ETSC",
  },
  {
    key: "etsc_decision_label_rms",
    EN: "ETSC decision complete",
    AR: "اكتمل قرار ETSC",
  },
  {
    key: "etsc_decision_label_rms1",
    EN: "ETSC decision complete",
    AR: "اكتمل قرار ETSC",
  },
  {
    key: "free_text_label_rms",
    EN: "Scholarship Approved",
    AR: "تمت الموافقة على المنحة",
  },
  {
    key: "free_text_label_rms1",
    EN: "Scholarship Approved",
    AR: "تمت الموافقة على المنحة",
  },
  {
    key: "Speciality_lbl",
    EN: "Speciality *",
    AR: "تخصص *",
  }, 
  {
    key: "Tracking_label",
    EN: "Tracking Id",
    AR: "معرف التتبع",
  },
  {
    key: "Assign_To_label",
    EN: "Assign To",
    AR: "يسند إلى",
  }, 
  {
    key: "يناير",
    EN: "January",
    AR: "يناير",
  },

  {
    key: "فبراير",
    EN: "February",
    AR: "فبراير",
  },

  {
    key: "مارس",
    EN: "March",
    AR: "مارس",
  },

  {
    key: "أبريل",
    EN: "April",
    AR: "أبريل",
  }, 
  {
    key: "قد",
    EN: "May",
    AR: "قد ",
  },
  {
    key: "يونيو",
    EN: "June",
    AR: "يونيو",
  },
  {
    key: "يوليو ",
    EN: "July",
    AR: "يوليو ",
  },
  {
    key: "أغسطس",
    EN: "August",
    AR: "أغسطس",
  },
  {
    key: "سبتمبر ",
    EN: "September",
    AR: "سبتمبر ",
  },
  {
    key: "اكتوبر ",
    EN: "October",
    AR: "اكتوبر ",
  },
  {
    key: "نوفمبر",
    EN: "November",
    AR: "نوفمبر",
  },
  {
    key: "ديسمبر ",
    EN: "December",
    AR: "ديسمبر ",
  }, 

  {
    key: "btn_program_new",
    EN: "Add New Program",
    AR: "إضافة برنامج جديد",
  },
  {
    key: "roles",
    EN: "Roles",
    AR: "إضافة برنامج جديد",
  },
  {
    key: "role_name",
    EN: "Role Name",
    AR: "إضافة برنامج جديد",
  },{
    key: "permissions",
    EN: "Permissions",
    AR: "إضافة برنامج جديد",
  },{
    key: "all_permissions",
    EN: "All Permissions",
    AR: "إضافة برنامج جديد",
  },{
    key: "permissions_name",
    EN: "Permissions Name",
    AR: "إضافة برنامج جديد",
  },{
    key: "permission_assign",
    EN: "Permission Assign",
    AR: "إضافة برنامج جديد",
  },{
    key: "special_permission_assign",
    EN: "Assign Special Permission",
    AR: "إضافة برنامج جديد",
  },{
    key: "modify_permission",
    EN: "Modify Permission",
    AR: "إضافة برنامج جديد",
    
  },{
    key: "please_select_role",
    EN: "Please Select Role",
    AR: "إضافة برنامج جديد",
    
  },{
    key: "please_select_user",
    EN: "Please Select User",
    AR: "إضافة برنامج جديد",
    
  },{
    key: "user",
    EN: "User",
    AR: "إضافة برنامج جديد",
    
  },
  
  {
    key: "please_enter_parent_id",
    EN: "Please enter parent id",
    AR: "إضافة برنامج جديد",
  },
  {
    key: "please_enter_sort_id",
    EN: "Please enter sort id",
    AR: "إضافة برنامج جديد",
  },
  {
    key: "modify_role",
    EN: "Modify Role",
    AR: "إضافة برنامج جديد",
  },
  
  {
    key: "all_role",
    EN: "All Roles",
    AR: "إضافة برنامج جديد",
  },{
    key: "sno",
    EN: "Sno",
    AR: "إضافة برنامج جديد",
  } ,{
    key: "menu",
    EN: "Menu",
    AR: "إضافة برنامج جديد",
  } ,{
    key: "user_role",
    EN: "User Role",
    AR: "إضافة برنامج جديد",
  } ,{
    key: "user_role_copy",
    EN: "Copy User Role",
    AR: "إضافة برنامج جديد",
  } ,{
    key: "na",
    EN: "N/A",
    AR: "إضافة برنامج جديد",
  },{
    key: "none",
    EN: "None",
    AR: "إضافة برنامج جديد",
  },{
    key: "modules",
    EN: "Modules",
    AR: "إضافة برنامج جديد",
  },{
    key: "details",
    EN: "Details",
    AR: "إضافة برنامج جديد",
  },{
    key: "menu_list",
    EN: "Menu List",
    AR: "إضافة برنامج جديد",
  },{
    key: "parent_ul",
    EN: "Parent ul",
    AR: "إضافة برنامج جديد",
  },{
    key: "parent_ul_class",
    EN: "Parent ul class",
    AR: "إضافة برنامج جديد",
  },{
    key: "parent_ul_id",
    EN: "Parent ul id",
    AR: "إضافة برنامج جديد",
  },{
    key: "parent_li",
    EN: "Parent li",
    AR: "إضافة برنامج جديد",
  },{
    key: "child_ul",
    EN: "Child ul",
    AR: "إضافة برنامج جديد",
  },{
    key: "child_ul_class",
    EN: "Child ul class",
    AR: "إضافة برنامج جديد",
  },{
    key: "child_li",
    EN: "Child li",
    AR: "إضافة برنامج جديد",
  },{
    key: "please_enter_title",
    EN: "Please enter title",
    AR: "إضافة برنامج جديد",
  },{
    key: "language",
    EN: "Language",
    AR: "إضافة برنامج جديد",
  },{
    key: "admin_plugins",
    EN: "Plugins",
    AR: "",
  },{
  },{
    key: "plugin",
    EN: "Plugins",
    AR: "",
  },{
    key: "please_enter_purchase_code",
    EN: "Please enter purchase code",
    AR: "",
  },{
    key: "admin_filemanager",
    EN: "File Manager",
    AR: "",
  },{
    key: "theme",
    EN: "Theme",
    AR: "",
  }
  ,{
    key: "themes",
    EN: "Themes",
    AR: "",
  }
  ,{
    key: "formbuilder",
    EN: "Form Builder",
    AR: "",
  }
  ,{
    key: "max_file_size_5mb",
    EN: "(max file size 5mb)",
    AR: "",
  }
  ,{
    key: "somthing_went_worng",
    EN: "Somthing went worng",
    AR: "",
  }
  
  ,{
    key: "add",
    EN: "Add",
    AR: "",
  }
  ,{
    key: "widget",
    EN: "Widgets",
    AR: "",
  },{
    key: "form_builder",
    EN: "Form Builder",
    AR: "",
  },{
    key: "please_enter_role_name",
    EN: "Please enter role name",
    AR: "",
  },{
    key: "please_enter_permission_name",
    EN: "Please enter permission name",
    AR: "",
  }
  ,{
    key: "please_enter_valid_password",
    EN: "Please enter valid password",
    AR: "",
  }
  ,{
    key: "default_page",
    EN: "Default page",
    AR: "",
  }
  ,{
    key: "pages",
    EN: "Pages",
    AR: "",
  }
  ,{
    key: "categories",
    EN: "Categories",
    AR: "",
  }
  ,{
    key: "brands",
    EN: "Brands",
    AR: "",
  }

  ,{
    key: "brand",
    EN: "Brand",
    AR: "",
  }

// Brand table column
  ,{
    key: "brandname",
    EN: "Brand Name",
    AR: "",
  }
  
//   slug
// logo
// order_level
// description
// meta_title
// meta_description

,{
  key: "slug",
  EN: "Slug",
  AR: "",
}
,{
  key: "parent_id",
  EN: "Parent ID",
  AR: "",
}
,{
  key: "logo",
  EN: "Logo",
  AR: "",
}
,{
  key: "parent_category",
  EN: "Parent Category",
  AR: "",
}
,{
  key: "order_level",
  EN: "Order Level",
  AR: "",
}
,{
  key: "description",
  EN: "Description",
  AR: "",
}
,{
  key: "meta_title",
  EN: "Meta Title",
  AR: "",
}
,{
  key: "meta_description",
  EN: "Meta Description",
  AR: "",
}
,{
  key: "social_title",
  EN: "Social Title",
  AR: "",
}
,{
  key: "social_description",
  EN: "Social Description",
  AR: "",
}
,{
  key: "social_image",
  EN: "Social Image",
  AR: "",
}

,{
  key: "title",
  EN: "Title",
  AR: "",
}

,{
  key: "banner",
  EN: "Banner Image",
  AR: "",
}
,{
  key: "icon",
  EN: "Category Icon",
  AR: "",
}
,{
  key: "attributes",
  EN: "Attributes",
  AR: "",
}
,{
  key: "attribute",
  EN: "Attribute",
  AR: "",
}
,{
  key: "attribute_name",
  EN: "Attribute Name",
  AR: "",
}
,{
  key: "attributes_values",
  EN: "Attributes Values",
  AR: "",
}
,{
  key: "attribute_value",
  EN: "Attribute Value",
  AR: "",
}
,{
  key: "attribute_name",
  EN: "Attribute Name",
  AR: "",
}
,{
  key: "color_code",
  EN: "Color Code",
  AR: "",
}
,{
  key: "values",
  EN: "Values",
  AR: "",
}
,{
  key: "product",
  EN: "Product",
  AR: "",
}
,{
  key: "unit_price",
  EN: "Unit Price",
  AR: "",
}
,{
  key: "short_description",
  EN: "Short Description",
  AR: "",
}
,{
  key: "description",
  EN: "Description",
  AR: "",
}

,{
  key: "category_name",
  EN: "Category Name",
  AR: "",
}

,{
  key: "brand_name",
  EN: "Brand Name",
  AR: "",
}
,{
  key: "product_name",
  EN: "Product Name",
  AR: "",
}
,{
  key: "product_image",
  EN: "Product Image",
  AR: "",
}
,{
  key: "attrubute",
  EN: "Attribute",
  AR: "",
}
,{
  key:"product_edit_attribute",
  EN: "Product Edit Attributes",
  AR: "",
}
,{
  key: "product_attributes",
  EN: "Product Attributes",
  AR: "",
}
,{
  key: "product_name",
  EN: "Product Name",
  AR: "",
}
,{
  key: "varient",
  EN: "Variant",
  AR: "",
}
,{
  key: "sku",
  EN: "Sku",
  AR: "",
}
,{
  key: "price",
  EN: "Price",
  AR: "",
}

,{
  key: "quantity",
  EN: "Quantity",
  AR: "",
}
,{
  key: "varient_image",
  EN: "Variant Image",
  AR: "",
},
{
  key: "product_images",
  EN: "Product Images",
  AR: "",
},
{
  key: "inventory",
  EN: "Inventory",
  AR: "",
},
{
  key: "customer",
  EN: "Customer",
  AR: "",
},
{
  key: "customer_email",
  EN: "Customer Email",
  AR: "",
},
{
  key: "warehouses_values",
  EN: "Warehouse Values",
  AR: "",
},
{
  key: "value",
  EN: "Value",
  AR: "",
},
{
  key: "warehouse",
  EN: "Warehouse",
  AR: "",
},
{
  key: "warehouse_name",
  EN: "Warehouse Name",
  AR: "",
},
{
  key: "warehouses_locations",
  EN: "Warehouse Locations",
  AR: "",
},
{
  key: "warehouse_name",
  EN: "Warehouse Name",
  AR: "",
},
{
  key: "prefix",
  EN: "Prefix",
  AR: "",
},
{
  key: "location_name",
  EN: "Location Name",
  AR: "",
},
{
  key: "location_address",
  EN: "Location Address",
  AR: "",
},
{
  key: "capacity",
  EN: "Capacity",
  AR: "",
},
{
  key: "current_stock_level",
  EN: "Current Stock Level",
  AR: "",
},
{
  key: "manager",
  EN: "Manager",
  AR: "",
},
{
  key: "order",
  EN: "Order",
  AR: "",
},
{
  key: "warehouse_location_name",
  EN: "Location Name",
  AR: "",
},
{
  key: "receive_marketing_emails",
  EN: "Receive Marketing Emails",
  AR: "",
},
{
  key: "receive_marketing_sms",
  EN: "Receive Marketing sms",
  AR: "",
},
{
  key: "tax_setting",
  EN: "Tax Setting",
  AR: "",
},
{
  key: "company",
  EN: "Company",
  AR: "",
},
{
  key: "phone",
  EN: "Phone",
  AR: "",
},
{
  key: "address",
  EN: "Address",
  AR: "",
},
{
  key: "apartment",
  EN: "Apartment",
  AR: "",
},
{
  key: "city",
  EN: "City",
  AR: "",
},
{
  key: "country",
  EN: "Country",
  AR: "",
},
{
  key: "billing_address",
  EN: "Billing Address",
  AR: "",
},
{
  key: "add_shipping_address",
  EN: "Add Shipping Address",
  AR: "",
},
{
  key: "country",
  EN: "Country",
  AR: "",
},
{
  key: "state",
  EN: "State",
  AR: "",
},
{
  key: "phone_number",
  EN: "Phone Number",
  AR: "",
},
{
  key: "contact_name",
  EN: "Contact name",
  AR: "",
},
{
  key: "supplier",
  EN: "Supplier",
  AR: "",
},
{
  key: "payment_terms",
  EN: "Payment Terms",
  AR: "",
},
{
  key: "company_name",
  EN: "Company name",
  AR: "",
},
{
  key: "company_id",
  EN: "Company ID",
  AR: "",
},
{
  key: "main_contact_id",
  EN: "Main Contact ID",
  AR: "",
},
{
  key: "location_id",
  EN: "Location ID",
  AR: "",
},
{
  key: "payment_terms_id",
  EN: "Payment Terms ID",
  AR: "",
},
{
  key: "tax_id",
  EN: "Tax ID",
  AR: "",
},
{
  key: "ship_to_address",
  EN: "Ship to address",
  AR: "",
},
{
  key: "catalogs_id",
  EN: "Catalogs ID",
  AR: "",
},
{
  key: "payment_term",
  EN: "Payment Term",
  AR: "",
},
{
  key: "order_submission",
  EN: "Order Submission",
  AR: "",
},
{
  key: "product_name",
  EN: "Product Name",
  AR: "",
},
{
  key: "varaint_name",
  EN: "Varaint Name",
  AR: "",
},
{
  key: "product_price",
  EN: "Product Price",
  AR: "",
},
{
  key: "product_qty",
  EN: "Product Qty",
  AR: "",
},
{
  key: "abonded_order",
  EN: "Abonded Order",
  AR: "",
},
{
  key: "abandoned_order",
  EN: "Abandoned Order",
  AR: "",
},
{
  key: "product_img",
  EN: "Product img",
  AR: "",
},
{
  key: "countries",
  EN: "Countries",
  AR: "",
},
{
  key: "market",
  EN: "Market",
  AR: "",
},
{
  key: "app_language_code",
  EN: "App Language Code",
  AR: "",
},
{
  key: "blog_title",
  EN: "Blog Title",
  AR: "",
},
{
  key: "category",
  EN: "Category",
  AR: "",
},
{
  key: "tags",
  EN: "Tags",
  AR: "",
},
{
  key: "thumbnail_image",
  EN: "Thumbnail Image",
  AR: "",
},
{
  key: "banner_image",
  EN: "Banner Image",
  AR: "",
},
{
  key: "author",
  EN: "Author",
  AR: "",
},
{
  key: "author_image",
  EN: "Author Image",
  AR: "",
},
{
  key: "post_date",
  EN: "Post Date",
  AR: "",
},
{
  key: "meta_keywords",
  EN: "Meta Keywords",
  AR: "",
},
{
  key: "meta_image",
  EN: "Meta Image",
  AR: "",
},
{
  key: "sort_order",
  EN: "Sort Order",
  AR: "",
},

];
