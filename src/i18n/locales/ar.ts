import { LocaleKeys } from "./en";

export const ar: LocaleKeys = {
	common: {
		loading: "جاري التحميل...",
		save: "حفظ",
		cancel: "إلغاء",
		delete: "حذف",
		edit: "تعديل",
		add: "إضافة",
		search: "بحث",
		export: "تصدير",
		import: "استيراد",
		send: "إرسال",
		close: "إغلاق",
		yes: "نعم",
		no: "لا",
		success: "نجح",
		error: "خطأ",
		required: "مطلوب",
		optional: "اختياري"
	},
	app: {
		title: "إرسال"
	},
	sidebar: {
		home: "الرئيسية",
		members: "الأعضاء",
		settings: "الإعدادات"
	},
	home: {
		title: "لوحة التحكم",
		subtitle: "نظرة عامة على حملات الرسائل النصية والأعضاء",
		sendCampaign: "إرسال حملة",
		stats: {
			totalMembers: "إجمالي الأعضاء",
			recentCampaigns: "الحملات الأخيرة",
			messagesSent: "الرسائل المرسلة"
		},
		recentMembers: "الأعضاء الجدد",
		noMembers: "لا توجد أعضاء. أضف بعض الأعضاء للبدء!",
		showingMembers: "عرض {{count}} من {{total}} عضو",
		modal: {
			title: "إرسال حملة رسائل نصية",
			recipients: "المستقبلون: {{count}} عضو سيستقبل هذه الرسالة",
			message: "الرسالة",
			messagePlaceholder: "أدخل رسالتك هنا...",
			aiTranslate: "ترجمة ذكية",
			aiTranslateTooltip:
				"ترجمة تلقائية لإنشاء رسالة ثنائية اللغة (عربية ↔ سويدية)",
			translating: "جاري الترجمة...",
			characterCount: "{{count}} حرف • {{sms}} رسالة نصية",
			characterCountPlural: "{{count}} حرف • {{sms}} رسالة نصية",
			charsUntilNext: "{{count}} حرف حتى الرسالة التالية",
			sendToMembers: "إرسال إلى {{count}} عضو",
			sending: "جاري الإرسال...",
			enterMessage: "يرجى إدخال رسالة",
			noMembers: "لا توجد أعضاء لإرسال الرسائل إليهم",
			confirmSend: "هل أنت متأكد من إرسال هذه الرسالة إلى {{count}} عضو؟",
			viewErrors: "عرض الأخطاء ({{count}})"
		}
	},
	members: {
		title: "الأعضاء",
		total: "{{count}} إجمالي",
		addMember: "إضافة عضو",
		importMembers: "استيراد الأعضاء",
		exportMembers: "تصدير الأعضاء",
		searchPlaceholder: "البحث في الأعضاء بالاسم أو الهاتف أو المدينة...",
		noMembers: "لا توجد أعضاء",
		noMembersDescription: "ابدأ بإضافة عضوك الأول.",
		adjustSearch: "حاول تعديل مصطلحات البحث",
		table: {
			name: "الاسم",
			city: "المدينة",
			phone: "الهاتف",
			added: "أُضيف",
			actions: "الإجراءات"
		},
		form: {
			firstName: "الاسم الأول",
			lastName: "اسم العائلة",
			city: "المدينة",
			phoneNumber: "رقم الهاتف",
			firstNamePlaceholder: "أدخل الاسم الأول",
			lastNamePlaceholder: "أدخل اسم العائلة",
			cityPlaceholder: "أدخل المدينة (اختياري)",
			phonePlaceholder: "أدخل رقم الهاتف",
			fillRequired: "يرجى ملء جميع الحقول المطلوبة",
			addMember: "إضافة عضو",
			editMember: "تعديل العضو",
			saving: "جاري الحفظ..."
		},
		import: {
			title: "استيراد الأعضاء",
			description: "استيراد الأعضاء من ملفات CSV أو Excel",
			selectFile: "اختر ملف",
			supportedFormats: "التنسيقات المدعومة: CSV، XLSX، XLS",
			expectedColumns:
				"الأعمدة المتوقعة: FirstName، LastName، City (اختياري)، Mobile",
			preview: "معاينة ({{count}} عضو)",
			importMembers: "استيراد {{count}} عضو",
			importing: "جاري الاستيراد...",
			selectFileFirst: "يرجى اختيار ملف أولاً",
			invalidFile: "يرجى اختيار ملف CSV أو Excel",
			parseError: "خطأ في تحليل الملف",
			importSuccess: "تم استيراد {{count}} عضو بنجاح",
			importError:
				"اكتمل الاستيراد مع بعض الأخطاء: {{success}} نجح، {{failed}} فشل"
		},
		delete: {
			confirm: "هل أنت متأكد من حذف هذا العضو؟"
		}
	},
	settings: {
		title: "الإعدادات",
		subtitle: "تكوين إعدادات Twilio للرسائل النصية",
		twilio: {
			title: "تكوين Twilio",
			accountSid: "معرف الحساب",
			accountSidDescription: 'معرف حساب Twilio الخاص بك (34 حرف، يبدأ بـ "AC")',
			accountSidPlaceholder: "ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
			authToken: "رمز المصادقة",
			authTokenDescription:
				"رمز مصادقة Twilio الخاص بك (32 حرف، احتفظ به سرياً!)",
			authTokenPlaceholder: "رمز مصادقة من 32 حرف",
			phoneNumber: "رقم هاتف Twilio",
			phoneNumberDescription:
				"رقم الهاتف الذي اشتريته من Twilio (بما في ذلك رمز البلد)",
			phoneNumberPlaceholder: "+966501234567",
			senderId: "معرف المرسل الأبجدي الرقمي",
			senderIdDescription:
				"اختياري. اسم مرسل مخصص (حد أقصى 11 حرف، أحرف وأرقام فقط). اتركه فارغاً لاستخدام رقم هاتف Twilio.",
			senderIdPlaceholder: "مسجد",
			charactersRemaining: "الأحرف المتبقية: {{count}}",
			saveSettings: "حفظ الإعدادات",
			saving: "جاري الحفظ...",
			saveSuccess: "تم حفظ الإعدادات بنجاح!",
			saveFailed: "فشل في حفظ الإعدادات. حاول مرة أخرى.",
			saveError: "خطأ في حفظ الإعدادات. حاول مرة أخرى."
		},
		validation: {
			accountSidRequired: "معرف الحساب مطلوب",
			accountSidInvalid: "يجب أن يبدأ معرف الحساب بـ 'AC' ويكون طوله 34 حرف",
			authTokenRequired: "رمز المصادقة مطلوب",
			authTokenInvalid: "يجب أن يكون رمز المصادقة 32 حرف",
			phoneNumberRequired: "رقم الهاتف مطلوب",
			phoneNumberInvalid: "يجب أن يبدأ رقم الهاتف بـ + ويشمل رمز البلد",
			senderIdTooLong: "معرف المرسل يجب أن يكون 11 حرف أو أقل",
			senderIdInvalid: "معرف المرسل يجب أن يحتوي على أحرف وأرقام فقط",
			deepSeekApiKeyRequired: "مفتاح API لـ DeepSeek مطلوب",
			deepSeekApiKeyInvalid:
				"مفتاح API لـ DeepSeek يجب أن يبدأ بـ 'sk-' ويكون طوله 20 حرف"
		},
		help: {
			title: "كيفية الحصول على بيانات اعتماد Twilio:",
			step1: "سجل الدخول إلى وحدة تحكم Twilio",
			step2: "ابحث عن معرف الحساب ورمز المصادقة في لوحة التحكم",
			step3: "اشتر رقم هاتف من قسم أرقام الهواتف",
			step4: "(اختياري) قم بإعداد معرف مرسل أبجدي رقمي للبلدان المدعومة"
		},
		deepSeek: {
			title: "ترجمة ديب سيك AI",
			apiKey: "مفتاح API",
			apiKeyDescription:
				"مفتاح API الخاص بك لخدمات الترجمة بالذكاء الاصطناعي (احتفظ به سريًا!)",
			apiKeyPlaceholder: "sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
			saveSettings: "حفظ الإعدادات",
			saving: "جارٍ الحفظ...",
			saveSuccess: "تم حفظ إعدادات ديب سيك بنجاح!",
			saveFailed: "فشل في حفظ إعدادات ديب سيك. يرجى المحاولة مرة أخرى.",
			saveError: "حدث خطأ أثناء حفظ إعدادات ديب سيك. يرجى المحاولة مرة أخرى."
		},
		deepSeekHelp: {
			title: "كيفية الحصول على مفتاح DeepSeek API:",
			step1: "أنشئ حسابًا على منصة DeepSeek",
			step2: "اذهب إلى قسم مفاتيح API في لوحة التحكم",
			step3: "قم بإنشاء مفتاح API جديد",
			step4: "انسخ المفتاح والصقه في الحقل أعلاه (يبدأ بـ 'sk-')"
		}
	}
};
