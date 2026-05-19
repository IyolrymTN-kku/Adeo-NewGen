import { PrismaClient, ServiceCategory, PartnerCategory } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // ── Admin User ────────────────────────────────────────────────────────────
  const hashedPassword = await bcrypt.hash("Admin@ADEO2025!", 12);

  const admin = await prisma.user.upsert({
    where: { email: "admin@adeo.co.th" },
    update: {},
    create: {
      name: "ADEO Admin",
      email: "admin@adeo.co.th",
      password: hashedPassword,
      role: "ADMIN",
    },
  });
  console.log(`✅ Admin user: ${admin.email}`);

  // ── Services ──────────────────────────────────────────────────────────────
  const services = [
    // IT Solutions
    {
      title: "Software Development",
      slug: "software-development",
      shortDescription:
        "Custom enterprise software engineered to your exact business workflows.",
      description:
        "We design and build scalable, secure enterprise applications from the ground up. From ERP integrations and custom web portals to mobile applications and API platforms, our team delivers production-ready software that grows with your business.",
      category: ServiceCategory.SOFTWARE_DEV,
      features: JSON.stringify([
        "Full-cycle development (design → deployment)",
        "Custom ERP & CRM integrations",
        "RESTful & GraphQL API development",
        "Cross-platform mobile applications",
        "DevOps CI/CD pipeline setup",
        "Post-launch maintenance & SLA support",
      ]),
      sortOrder: 1,
    },
    {
      title: "IT Support & Helpdesk",
      slug: "it-support",
      shortDescription:
        "Proactive IT support and 24/7 helpdesk to keep your operations running.",
      description:
        "Our managed IT support service gives your team direct access to certified engineers for day-to-day operations, incident response, and proactive system monitoring. We eliminate downtime before it impacts your business.",
      category: ServiceCategory.IT_SUPPORT,
      features: JSON.stringify([
        "24/7 helpdesk with defined SLA tiers",
        "Remote & on-site support coverage",
        "Proactive monitoring & alerting",
        "Patch management & endpoint security",
        "IT asset lifecycle management",
        "Monthly health reports & reviews",
      ]),
      sortOrder: 2,
    },
    {
      title: "Network Infrastructure",
      slug: "network-infrastructure",
      shortDescription:
        "Enterprise-grade network design, deployment, and management.",
      description:
        "We architect and deploy high-availability network infrastructure — from campus LAN/WAN to data centre switching and SD-WAN overlays. Our designs are built for redundancy, security, and future capacity.",
      category: ServiceCategory.NETWORK,
      features: JSON.stringify([
        "LAN/WAN design & implementation",
        "SD-WAN & MPLS connectivity",
        "Wireless (Wi-Fi 6/6E) deployment",
        "Network segmentation & VLAN design",
        "Firewall & unified threat management",
        "Network performance monitoring (NPM)",
      ]),
      sortOrder: 3,
    },
    // Cloud Services
    {
      title: "Cloud Native Development",
      slug: "cloud-native",
      shortDescription:
        "Build and run applications designed for cloud scale and resilience.",
      description:
        "We help organisations move beyond lift-and-shift by building cloud-native applications using containers, Kubernetes, and serverless architectures. The result is higher availability, lower cost, and faster feature delivery.",
      category: ServiceCategory.CLOUD_NATIVE,
      features: JSON.stringify([
        "Microservices architecture design",
        "Docker & Kubernetes orchestration",
        "Serverless function development",
        "Service mesh (Istio / Linkerd)",
        "GitOps & automated deployment pipelines",
        "Cost optimisation & right-sizing",
      ]),
      sortOrder: 4,
    },
    {
      title: "Cloud Migration",
      slug: "cloud-migration",
      shortDescription:
        "Risk-managed migration of on-premises workloads to public cloud.",
      description:
        "Our structured cloud migration methodology (Assess → Plan → Migrate → Optimise) minimises risk and downtime. We handle everything from initial workload discovery and TCO analysis through to production cutover and hyperscaler optimisation.",
      category: ServiceCategory.MIGRATION,
      features: JSON.stringify([
        "Workload discovery & dependency mapping",
        "TCO analysis & business case",
        "AWS / Azure / GCP migration expertise",
        "Database migration & modernisation",
        "Zero-downtime cutover planning",
        "Post-migration optimisation & FinOps",
      ]),
      sortOrder: 5,
    },
    {
      title: "Cloud Connectivity",
      slug: "cloud-connectivity",
      shortDescription:
        "Secure, high-speed connectivity between your premises and the cloud.",
      description:
        "We deliver reliable, low-latency connections to hyperscaler regions using Direct Connect, ExpressRoute, and private cloud interconnects. Combined with SD-WAN overlays, your hybrid cloud environment performs like a single unified network.",
      category: ServiceCategory.CONNECTIVITY,
      features: JSON.stringify([
        "AWS Direct Connect & Azure ExpressRoute",
        "Private cloud interconnect (MPLS)",
        "SD-WAN hybrid cloud integration",
        "Redundant & diverse path design",
        "BGP routing & traffic engineering",
        "24/7 connectivity monitoring",
      ]),
      sortOrder: 6,
    },
    {
      title: "Backup & Disaster Recovery",
      slug: "backup-dr",
      shortDescription:
        "Cloud-based backup and DR that meets your RPO and RTO objectives.",
      description:
        "We design and operate cloud backup and disaster recovery solutions that protect your critical data and systems. From automated daily backups with immutable storage to fully orchestrated DR failover, we keep your business running no matter what.",
      category: ServiceCategory.BACKUP_DR,
      features: JSON.stringify([
        "RPO/RTO assessment & SLA definition",
        "Automated cloud backup (daily / hourly)",
        "Immutable backup storage (ransomware protection)",
        "Orchestrated DR failover & failback",
        "Regular DR drills & test reporting",
        "Backup compliance & audit trails",
      ]),
      sortOrder: 7,
    },
  ];

  for (const service of services) {
    await prisma.service.upsert({
      where: { slug: service.slug },
      update: {},
      create: service,
    });
    console.log(`✅ Service: ${service.title}`);
  }

  // ── Partners ──────────────────────────────────────────────────────────────
  const partners = [
    // Network
    { name: "Cisco", logoUrl: "/uploads/placeholder-logo.svg", category: PartnerCategory.NETWORK, sortOrder: 1 },
    { name: "Juniper Networks", logoUrl: "/uploads/placeholder-logo.svg", category: PartnerCategory.NETWORK, sortOrder: 2 },
    { name: "Aruba Networks", logoUrl: "/uploads/placeholder-logo.svg", category: PartnerCategory.NETWORK, sortOrder: 3 },
    // Cloud
    { name: "Amazon Web Services", logoUrl: "/uploads/placeholder-logo.svg", category: PartnerCategory.CLOUD, websiteUrl: "https://aws.amazon.com", sortOrder: 1 },
    { name: "Microsoft Azure", logoUrl: "/uploads/placeholder-logo.svg", category: PartnerCategory.CLOUD, websiteUrl: "https://azure.microsoft.com", sortOrder: 2 },
    { name: "Google Cloud", logoUrl: "/uploads/placeholder-logo.svg", category: PartnerCategory.CLOUD, websiteUrl: "https://cloud.google.com", sortOrder: 3 },
    // Security
    { name: "Palo Alto Networks", logoUrl: "/uploads/placeholder-logo.svg", category: PartnerCategory.SECURITY, sortOrder: 1 },
    { name: "Fortinet", logoUrl: "/uploads/placeholder-logo.svg", category: PartnerCategory.SECURITY, sortOrder: 2 },
    { name: "CrowdStrike", logoUrl: "/uploads/placeholder-logo.svg", category: PartnerCategory.SECURITY, sortOrder: 3 },
    // Hardware
    { name: "Dell Technologies", logoUrl: "/uploads/placeholder-logo.svg", category: PartnerCategory.HARDWARE, sortOrder: 1 },
    { name: "HPE", logoUrl: "/uploads/placeholder-logo.svg", category: PartnerCategory.HARDWARE, sortOrder: 2 },
    { name: "Lenovo", logoUrl: "/uploads/placeholder-logo.svg", category: PartnerCategory.HARDWARE, sortOrder: 3 },
  ];

  for (const partner of partners) {
    await prisma.partner.upsert({
      where: { id: `seed-${partner.name.toLowerCase().replace(/\s+/g, "-")}` },
      update: {},
      create: {
        id: `seed-${partner.name.toLowerCase().replace(/\s+/g, "-")}`,
        ...partner,
      },
    });
    console.log(`✅ Partner: ${partner.name} [${partner.category}]`);
  }

  // ── Sample Contact Submission ─────────────────────────────────────────────
  await prisma.contactSubmission.create({
    data: {
      name: "Somchai Jaidee",
      email: "somchai@example.co.th",
      company: "Thai Manufacturing Co., Ltd.",
      phone: "+66 81 234 5678",
      message:
        "We are looking to migrate our on-premise ERP system to the cloud. Could you please provide more information about your Cloud Migration services and arrange a consultation?",
      status: "NEW",
    },
  });

  await prisma.siteSettings.upsert({
    where: { id: "singleton" },
    update: {},
    create: {
      id: "singleton",
      siteName: "ชื่อบริษัทใหม่",
    },
  });
  
  console.log("✅ Sample contact submission created");

  console.log("\n🎉 Seed complete!");
  console.log("─────────────────────────────────────────");
  console.log("Admin login:");
  console.log("  Email   : admin@adeo.co.th");
  console.log("  Password: Admin@ADEO2025!");
  console.log("─────────────────────────────────────────");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
  
