import { NextRequest, NextResponse } from "next/server";
import { getDatabase, incrementNovaConversations } from "@/lib/db";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message, language } = body;

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const db = await getDatabase();
    await incrementNovaConversations();

    const isArabic =
      language === "ar" ||
      /[\u0600-\u06FF]/.test(message);

    // Assemble verified knowledge context
    const knowledgeContext = `
VERIFIED PROFILE:
- Name: ${db.profile.name} (Arabic: ${db.profile.nameAr})
- Job Title: ${db.profile.jobTitle} (Arabic: ${db.profile.jobTitleAr})
- University: ${db.profile.university} (Arabic: ${db.profile.universityAr})
- Field of Study: ${db.profile.studyField} (${db.profile.studyYear})
- Location: ${db.profile.location} (Arabic: ${db.profile.locationAr})
- Availability: ${db.profile.availability}
- Email: ${db.profile.email}
- WhatsApp: ${db.profile.whatsapp}
- GitHub: ${db.profile.github}
- LinkedIn: ${db.profile.linkedin}
- Bio: ${db.profile.fullBio} (Arabic: ${db.profile.fullBioAr})

VERIFIED PROJECTS:
${db.projects
  .map(
    (p) =>
      `- Project: ${p.title} (Slug: ${p.slug}, Category: ${p.category})
   Description: ${p.shortDescription}
   Tech: ${p.technologies.join(", ")}
   Problem: ${p.problem || "N/A"}
   Solution: ${p.solution || "N/A"}
   Live URL: ${p.liveDemoUrl || "N/A"}
   GitHub: ${p.githubUrl || "N/A"}`
  )
  .join("\n")}

VERIFIED SKILLS:
${db.skills.map((s) => `- ${s.name} (${s.category}, Level: ${s.level}%)`).join("\n")}

VERIFIED EXPERIENCE & EDUCATION:
${db.timeline.map((t) => `- [${t.type.toUpperCase()}] ${t.title} at ${t.organization} (${t.startDate} - ${t.endDate}): ${t.description}`).join("\n")}

VERIFIED SERVICES:
${db.services.map((s) => `- ${s.title}: ${s.description}`).join("\n")}

VERIFIED KNOWLEDGE & FAQS:
${db.novaKnowledge
  .filter((k) => k.enabled)
  .map((k) => `Q: ${k.question} / ${k.questionAr || ""}\nA: ${k.answer} / ${k.answerAr || ""}`)
  .join("\n\n")}
`;

    const systemPrompt = `
You are NOVA, the intelligent voice assistant and digital twin of Abbas El Kady.
You must answer questions strictly based on the verified knowledge base about Abbas.
Tone: ${db.novaSettings.speakingTone || "innovative and professional"}.
IMPORTANT RULES:
1. NEVER hallucinate or invent personal information, projects, or credentials about Abbas.
2. If the user asks something not in the knowledge base, state politely that you do not have verified details on that yet and invite them to reach out to Abbas directly via the Contact section.
3. Respond concisely (2-4 sentences max) so that it is easily spoken via voice.
4. Respond in the same language as the user: ${isArabic ? "Arabic (العربية)" : "English"}.
5. If the user asks to see or open something on the website, append ONE structured action at the very end of your response in this exact format:
   [ACTION:NAVIGATE_SECTION:projects]
   [ACTION:NAVIGATE_SECTION:skills]
   [ACTION:NAVIGATE_SECTION:experience]
   [ACTION:NAVIGATE_SECTION:certificates]
   [ACTION:NAVIGATE_SECTION:services]
   [ACTION:NAVIGATE_SECTION:cv]
   [ACTION:NAVIGATE_SECTION:contact]
   [ACTION:OPEN_PROJECT:<slug>]
   [ACTION:FILTER_PROJECTS:<category>]
   [ACTION:OPEN_CV]
   [ACTION:CONTACT_ABBAS]
`;

    const apiKey = process.env.GEMINI_API_KEY;

    if (apiKey) {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const prompt = `${systemPrompt}\n\nKNOWLEDGE BASE:\n${knowledgeContext}\n\nUSER MESSAGE: ${message}`;
      const result = await model.generateContent(prompt);
      const reply = result.response.text();

      // Extract action if present
      const actionMatch = reply.match(/\[ACTION:([^\]]+)\]/);
      const cleanReply = reply.replace(/\[ACTION:[^\]]+\]/, "").trim();

      return NextResponse.json({
        reply: cleanReply,
        action: actionMatch ? actionMatch[1] : null,
        language: isArabic ? "ar" : "en",
      });
    } else {
      // High-precision local fallback matching engine
      const lower = message.toLowerCase();
      let reply = "";
      let action: string | null = null;

      if (
        lower.includes("who is") ||
        lower.includes("about") ||
        lower.includes("من هو") ||
        lower.includes("عن عباس") ||
        lower.includes("مين عباس")
      ) {
        reply = isArabic
          ? "عباس القاضي هو طالب بالفرقة الثالثة بكلية علوم الحاسب والذكاء الاصطناعي في القاهرة، متخصص في تطوير وكلاء الذكاء الاصطناعي (AI Agents)، وهندسة أتمتة العمليات المتقدمة عبر n8n، والأنظمة الرقمية الذكية."
          : "Abbas El Kady is a 3rd-year Computer Science & AI student and specialist based in Cairo, Egypt. He specializes in Autonomous AI Agents, Enterprise Automation with n8n, and building intelligent web experiences.";
        action = "NAVIGATE_SECTION:about";
      } else if (
        lower.includes("project") ||
        lower.includes("مشروع") ||
        lower.includes("مشاريع") ||
        lower.includes("اعمال") ||
        lower.includes("work")
      ) {
        reply = isArabic
          ? "قام عباس بتطوير العديد من الأنظمة المتقدمة مثل وكيل الذكاء الاصطناعي الصوتي NOVA، ومصفوفة الأتمتة المؤسسية عبر n8n، ومحركات البحث المعرفي RAG. سأعرض لك معرض المشاريع الآن."
          : "Abbas has developed cutting-edge systems including NOVA Voice AI Agent, an autonomous n8n Enterprise Automation Pipeline, and Cognitive RAG Engines. Navigating to his projects matrix now.";
        action = "NAVIGATE_SECTION:projects";
      } else if (
        lower.includes("n8n") ||
        lower.includes("automation") ||
        lower.includes("اتمتة") ||
        lower.includes("أتمتة")
      ) {
        reply = isArabic
          ? "عباس خبير في منصة n8n، حيث يقوم بتصميم مسارات أتمتة معقدة تربط واتساب وأنظمة إدارة العملاء وقواعد البيانات مع الذكاء الاصطناعي، مما يقلص العمل اليدوي بنسبة تتجاوز 70%."
          : "Abbas is a proficient n8n automation engineer. He designs workflows linking WhatsApp, CRMs, databases, and AI models to eliminate repetitive tasks and streamline operations.";
        action = "FILTER_PROJECTS:n8n";
      } else if (
        lower.includes("cv") ||
        lower.includes("resume") ||
        lower.includes("سيرة") ||
        lower.includes("سيرة ذاتية")
      ) {
        reply = isArabic
          ? "يمكنك استعراض وتحميل السيرة الذاتية الرسمية لعباس القاضي باللغتين العربية والإنجليزية من قسم السيرة الذاتية."
          : "You can preview and download Abbas El Kady's official executive CV in English or Arabic directly from the CV section.";
        action = "NAVIGATE_SECTION:cv";
      } else if (
        lower.includes("hire") ||
        lower.includes("contact") ||
        lower.includes("تواصل") ||
        lower.includes("توظيف") ||
        lower.includes("ايميل") ||
        lower.includes("واتساب")
      ) {
        reply = isArabic
          ? "عباس متاح للمشاريع النوعية والتعاون التقني وفرص هندسة الذكاء الاصطناعي والأتمتة. يمكنك مراسلته مباشرة عبر نموذج التواصل أو الواتساب."
          : "Abbas is available for high-impact projects, AI consultancy, and automation engineering roles. You can reach out directly through the contact section or WhatsApp.";
        action = "NAVIGATE_SECTION:contact";
      } else if (
        lower.includes("skill") ||
        lower.includes("tech") ||
        lower.includes("مهارات") ||
        lower.includes("لغات")
      ) {
        reply = isArabic
          ? "يتقن عباس العمل بنماذج الذكاء الاصطناعي و Gemini API و Python و TypeScript و Next.js و React و n8n و Docker وقواعد بيانات PostgreSQL و Supabase."
          : "Abbas's core technical stack comprises Google Gemini API, Autonomous AI Agents, Python, TypeScript, Next.js, React, n8n Automation, Docker, and PostgreSQL.";
        action = "NAVIGATE_SECTION:skills";
      } else {
        reply = isArabic
          ? "أنا نوفا، المساعد الذكي لعباس القاضي. أستطيع إجابتك عن مشاريعه، مهاراته في الذكاء الاصطناعي و n8n، أو مساعدتك في التواصل معه مباشرة."
          : "I am NOVA, Abbas El Kady's AI assistant. You can ask me about his AI projects, n8n automations, technical proficiencies, or how to get in touch with him.";
      }

      return NextResponse.json({
        reply,
        action,
        language: isArabic ? "ar" : "en",
      });
    }
  } catch (error) {
    console.error("NOVA Chat Error:", error);
    return NextResponse.json(
      { error: "Failed to process chat query" },
      { status: 500 }
    );
  }
}
