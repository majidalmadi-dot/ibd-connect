import React from 'react';
import { Text } from 'react-native';
import { useStore } from '../store/Store';
import { Screen, TitleRow } from '../components/ui';

const LEGAL = {
  terms: { en: ['Terms & Conditions', "By using IBD Connect you agree that this is a non-medical health companion application intended for personal tracking and education only. It does not provide medical advice, diagnosis, or treatment, and is not a substitute for professional healthcare. You are responsible for any decisions you make. The app and its content are provided 'as is' without warranties."], ar: ['الشروط والأحكام', "باستخدامك للتطبيق فإنك توافق على أنه تطبيق مرافقة صحية غير طبي مخصّص للتتبّع الشخصي والتثقيف فقط. لا يقدّم نصيحة طبية أو تشخيصًا أو علاجًا، وليس بديلًا عن الرعاية المتخصصة. أنت مسؤول عن قراراتك. يُقدَّم التطبيق ومحتواه 'كما هو' دون ضمانات."] },
  privacy: { en: ['Privacy Policy', 'Your privacy matters. All health logs are stored locally on your device. We do not collect medication names or doses. Optional anonymous usage analytics can be turned off at any time. You may export or permanently delete all your data from within the app. We will never sell your data.'], ar: ['سياسة الخصوصية', 'خصوصيتك تهمّنا. تُخزَّن جميع السجلات الصحية محليًا على جهازك. لا نجمع أسماء الأدوية أو الجرعات. يمكن إيقاف تحليلات الاستخدام المجهولة في أي وقت. يمكنك تصدير بياناتك أو حذفها نهائيًا. لن نبيع بياناتك أبدًا.'] },
  faq: { en: ['FAQ & Support', 'Q: Is IBD Connect a medical device? No — it is a non-medical companion for self-tracking.\n\nQ: Will it tell me if I am in a flare? No. Charts are descriptive only.\n\nQ: Is my data shared? No, it stays on your device unless you export it.\n\nNeed help? Contact support@ibdconnect.app'], ar: ['الأسئلة الشائعة والدعم', 'س: هل التطبيق جهاز طبي؟ لا — إنه رفيق غير طبي للتتبّع الذاتي.\n\nس: هل يخبرني إن كنت في نوبة؟ لا. الرسوم وصفية فقط.\n\nس: هل تُشارَك بياناتي؟ لا، تبقى على جهازك ما لم تصدّرها.\n\nبحاجة لمساعدة؟ راسلنا على support@ibdconnect.app'] },
  about: { en: ['About IBD Connect', 'IBD Connect helps people living with Inflammatory Bowel Disease track daily symptoms and lifestyle factors, visualise patterns over time, and access disease-specific education — within a non-medical, compliance-focused framework aligned with SFDA non-medical positioning. Educational content is provided by the SGA IBD Guide (IBDguide.net). Version 1.0.'], ar: ['عن التطبيق', 'يساعد التطبيق المتعايشين مع التهاب الأمعاء على تتبّع الأعراض اليومية وعوامل نمط الحياة، وتصوّر الأنماط، والوصول لمحتوى تثقيفي — ضمن إطار غير طبي متوافق مع تموضع SFDA. المحتوى التثقيفي من دليل IBD التابع للجمعية السعودية للجهاز الهضمي. الإصدار 1.0.'] },
};

export default function LegalScreen({ route, navigation }) {
  const { theme, isAr } = useStore();
  const c = LEGAL[route.params?.kind || 'about'][isAr ? 'ar' : 'en'];
  return (
    <Screen>
      <TitleRow title={c[0]} onBack={() => navigation.goBack()} />
      <Text style={{ color: theme.txt, fontSize: 14.5, lineHeight: 24, textAlign: isAr ? 'right' : 'left' }}>{c[1]}</Text>
    </Screen>
  );
}
