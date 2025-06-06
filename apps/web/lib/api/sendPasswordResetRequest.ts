import { randomBytes } from "crypto";
import { prisma } from "@linkwarden/prisma";
import transporter from "./transporter";
import Handlebars from "handlebars";
import { readFileSync } from "fs";
import path from "path";

export default async function sendPasswordResetRequest(
  email: string,
  user: string
) {
  const token = randomBytes(32).toString("hex");

  await prisma.passwordResetToken.create({
    data: {
      identifier: email?.toLowerCase(),
      token,
      expires: new Date(Date.now() + 24 * 3600 * 1000), // 1 day
    },
  });

  const emailsDir = path.resolve(process.cwd(), "templates");

  const templateFile = readFileSync(
    path.join(emailsDir, "passwordReset.html"),
    "utf8"
  );

  const emailTemplate = Handlebars.compile(templateFile);

  transporter.sendMail({
    from: {
      name: "Linkwarden",
      address: process.env.EMAIL_FROM as string,
    },
    to: email,
    subject: "Linkwarden: Reset password instructions",
    html: emailTemplate({
      user,
      baseUrl: process.env.BASE_URL,
      url: `${process.env.BASE_URL}/auth/reset-password?token=${token}`,
    }),
  });
}
