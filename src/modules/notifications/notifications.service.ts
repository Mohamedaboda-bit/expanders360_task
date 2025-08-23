import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as nodemailer from 'nodemailer';
import { Match } from '../../entities/match.entity';
import { Project } from '../../entities/project.entity';
import { Vendor } from '../../entities/vendor.entity';

@Injectable()
export class NotificationsService {
  private transporter: nodemailer.Transporter;

  constructor(
    private configService: ConfigService,
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
    @InjectRepository(Vendor)
    private vendorRepository: Repository<Vendor>,
  ) {
    const emailUser = this.configService.get<string>('EMAIL_USER') || 'expanders360@gmail.com';
    const emailPass = this.configService.get<string>('EMAIL_APP_PASSWORD') || 'pzkj ghac xcvb uenx';
    
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: emailUser,
        pass: emailPass,
      },
    });
  }

  async sendMatchNotification(match: Match): Promise<void> {
    const [project, vendor] = await Promise.all([
      this.projectRepository.findOne({
        where: { id: match.project_id },
        relations: ['client', 'services'],
      }),
      this.vendorRepository.findOne({
        where: { id: match.vendor_id },
        relations: ['services'],
      }),
    ]);

    if (!project || !vendor) {
      console.error('Could not find project or vendor for match notification');
      return;
    }

    const servicesOverlap = project.services
      .filter(s => vendor.services.some(vs => vs.id === s.id))
      .map(s => s.name)
      .join(', ');

    const mailOptions = {
      from: this.configService.get<string>('EMAIL_USER') || 'expanders360@gmail.com',
      to: this.configService.get<string>('NOTIFICATION_EMAIL') || 'expanders360@gmail.com',
      subject: '🔔 New Project-Vendor Match Found!',
      html: `
        <h2>New Match Generated</h2>
        <div style="background-color: #f9f9f9; padding: 20px; border-radius: 5px;">
          <h3>Project Details:</h3>
          <p><strong>Client:</strong> ${project.client.company_name}</p>
          <p><strong>Project ID:</strong> ${project.id}</p>
          <p><strong>Budget:</strong> $${project.budget}</p>
          <p><strong>Status:</strong> ${project.status}</p>
          
          <h3>Vendor Details:</h3>
          <p><strong>Name:</strong> ${vendor.name}</p>
          <p><strong>Rating:</strong> ${vendor.rating}/5</p>
          <p><strong>Response SLA:</strong> ${vendor.response_sla_hours} hours</p>
          
          <h3>Match Details:</h3>
          <p><strong>Match Score:</strong> ${match.score}</p>
          <p><strong>Matching Services:</strong> ${servicesOverlap}</p>
          <p><strong>Generated at:</strong> ${new Date(match.created_at).toLocaleString()}</p>
        </div>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`✅ Match notification email sent for Project ${project.id} and Vendor ${vendor.id}`);
    } catch (error) {
      console.error('Failed to send match notification email:', error.message);
    }
  }
}
