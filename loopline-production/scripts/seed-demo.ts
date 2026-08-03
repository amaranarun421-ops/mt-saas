// Seed script — creates a demo user + workspace + bot + sample conversations
// so the template ships with a realistic demo state for buyers to explore.
//
// Run with: bun run scripts/seed-demo.ts

import { db } from "../src/lib/db";
import bcrypt from "bcryptjs";

async function main() {
  console.log("🌱 Seeding Loopline demo data...");

  const email = "demo@loopline.dev";
  const password = "loopline123";

  // 1. Demo user
  const existing = await db.user.findUnique({ where: { email } });
  if (existing) {
    console.log(`  ✓ Demo user already exists: ${email}`);
    console.log(`    Password: ${password}`);
    return;
  }

  const hashed = await bcrypt.hash(password, 12);
  const user = await db.user.create({
    data: {
      email,
      name: "Demo User",
      password: hashed,
    },
  });

  // 2. Workspace
  const workspace = await db.workspace.create({
    data: {
      name: "Acme Support",
      ownerId: user.id,
      plan: "PRO",
    },
  });
  await db.user.update({
    where: { id: user.id },
    data: { workspaceId: workspace.id },
  });
  await db.subscription.create({
    data: {
      workspaceId: workspace.id,
      plan: "PRO",
      status: "ACTIVE",
      currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
  });

  // 3. Two demo bots
  const bot1 = await db.bot.create({
    data: {
      workspaceId: workspace.id,
      name: "Acme Support Bot",
      primaryColor: "#1a56db",
      welcomeMessage: "Hi! I'm the Acme Support Bot. How can I help you today?",
    },
  });

  const bot2 = await db.bot.create({
    data: {
      workspaceId: workspace.id,
      name: "Billing Helper",
      primaryColor: "#8b5cf6",
      welcomeMessage: "Hello! I can help with billing questions. What do you need?",
    },
  });

  // 4. Knowledge base for bot1
  const kbContent = `Frequently Asked Questions

Q: How do I reset my password?
A: Go to Settings → Security → Reset Password. You'll receive an email with a reset link valid for 30 minutes.

Q: What payment methods do you accept?
A: We accept Visa, Mastercard, and American Express via Stripe. For annual plans over $1,000, we also accept bank transfers.

Q: Can I cancel my subscription anytime?
A: Yes. Go to Billing → Manage Subscription → Cancel. Your plan stays active until the end of the current billing period, then downgrades to Free.

Q: Do you offer refunds?
A: We offer a 7-day money-back guarantee on all paid plans. Email hello@acme.dev with your request.

Q: How do I invite team members?
A: On the Pro plan and above, go to Settings → Members → Invite. Enter their email and they'll get an invite link.

Q: Is there an API?
A: Yes. Our REST API is available on all plans. API keys are generated from Settings → API Keys. Rate limit is 100 requests/minute on Free, 1000/minute on Pro.

Q: What's your uptime SLA?
A: 99.9% uptime on Pro and Agency plans. We monitor 24/7 and post incidents at status.acme.dev.

Q: Can I export my data?
A: Yes. Go to Settings → Data → Export. You'll get a JSON dump of all your workspace data within 5 minutes.`;

  // Chunk the KB
  const paragraphs = kbContent.split("\n\n").filter(Boolean);
  for (const para of paragraphs) {
    await db.knowledgeChunk.create({
      data: {
        botId: bot1.id,
        content: para,
        sourceName: "FAQ.md",
      },
    });
  }

  // 5. Sample conversations for bot1
  const conversations = [
    {
      visitorName: "Sarah Chen",
      status: "RESOLVED" as const,
      messages: [
        { role: "USER" as const, content: "How do I reset my password?" },
        { role: "ASSISTANT" as const, content: "Go to Settings → Security → Reset Password. You'll receive an email with a reset link valid for 30 minutes. Need me to walk you through anything else?" },
        { role: "USER" as const, content: "That worked, thanks!" },
        { role: "ASSISTANT" as const, content: "Glad to help! Have a great day. 👋" },
      ],
    },
    {
      visitorName: "Marcus Patel",
      status: "NEEDS_HUMAN" as const,
      messages: [
        { role: "USER" as const, content: "I was charged twice for my subscription this month" },
        { role: "ASSISTANT" as const, content: "I'm sorry to hear that. I've flagged this conversation for a human agent who can review your billing and process a refund. They'll follow up within 1 business hour." },
      ],
    },
    {
      visitorName: "Anonymous",
      status: "AI" as const,
      messages: [
        { role: "USER" as const, content: "Do you have an API?" },
        { role: "ASSISTANT" as const, content: "Yes! Our REST API is available on all plans. API keys are generated from Settings → API Keys. Rate limit is 100 requests/minute on Free, 1000/minute on Pro." },
      ],
    },
    {
      visitorName: "Elena Rossi",
      status: "RESOLVED" as const,
      messages: [
        { role: "USER" as const, content: "Can I cancel anytime?" },
        { role: "ASSISTANT" as const, content: "Yes. Go to Billing → Manage Subscription → Cancel. Your plan stays active until the end of the current billing period, then downgrades to Free." },
        { role: "USER" as const, content: "Perfect, thanks" },
      ],
    },
    {
      visitorName: "Anonymous",
      status: "AI" as const,
      messages: [
        { role: "USER" as const, content: "What payment methods do you accept?" },
        { role: "ASSISTANT" as const, content: "We accept Visa, Mastercard, and American Express via Stripe. For annual plans over $1,000, we also accept bank transfers." },
      ],
    },
  ];

  for (const c of conversations) {
    const conv = await db.conversation.create({
      data: {
        botId: bot1.id,
        visitorId: "seed_" + Math.random().toString(36).slice(2),
        visitorName: c.visitorName,
        status: c.status,
        title: c.messages[0].content.slice(0, 80),
      },
    });
    for (const m of c.messages) {
      await db.message.create({
        data: {
          conversationId: conv.id,
          role: m.role,
          content: m.content,
        },
      });
    }
  }

  console.log(`  ✓ Created demo user: ${email}`);
  console.log(`  ✓ Password: ${password}`);
  console.log(`  ✓ Workspace: ${workspace.name} (PRO plan)`);
  console.log(`  ✓ Created 2 bots, ${paragraphs.length} KB chunks, ${conversations.length} conversations`);
  console.log("\n🎉 Done! Sign in at /signin with:");
  console.log(`   Email:    ${email}`);
  console.log(`   Password: ${password}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
