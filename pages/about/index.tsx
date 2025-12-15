import React from 'react';
import { NextPage } from 'next';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import { Stack, Box, Button } from '@mui/material';
import withLayoutMain from '../../libs/components/layout/LayoutHome';
import {
	Users,
	Target,
	Award,
	TrendingUp,
	Heart,
	Zap,
	Shield,
	MessageCircle,
	ArrowRight,
	Phone,
	Mail,
	MapPin,
	Star,
	BookOpen,
	Briefcase,
	ShoppingBag,
	Calendar,
} from 'lucide-react';
import Link from 'next/link';

const About: NextPage = () => {
	const device = useDeviceDetect();

	// Statistics Data
	const statistics = [
		{ icon: <Users size={40} />, number: '2.5K+', label: 'Active Students', color: '#667eea' },
		{ icon: <MessageCircle size={40} />, number: '15K+', label: 'Posts Created', color: '#10b981' },
		{ icon: <Briefcase size={40} />, number: '500+', label: 'Job Opportunities', color: '#f59e0b' },
		{ icon: <ShoppingBag size={40} />, number: '1.2K+', label: 'Items Traded', color: '#ec4899' },
	];

	// Features Data
	const features = [
		{
			icon: <MessageCircle size={32} />,
			title: 'Community Forum',
			description: 'Connect with fellow students, share experiences, and engage in meaningful discussions.',
			color: '#667eea',
		},
		{
			icon: <Briefcase size={32} />,
			title: 'Job Board',
			description: 'Discover internship and part-time job opportunities tailored for university students.',
			color: '#10b981',
		},
		{
			icon: <ShoppingBag size={32} />,
			title: 'Marketplace',
			description: 'Buy and sell textbooks, electronics, and other items safely within the campus community.',
			color: '#f59e0b',
		},
		{
			icon: <Calendar size={32} />,
			title: 'Events & Activities',
			description: 'Stay updated with campus events, club activities, and important announcements.',
			color: '#ec4899',
		},
	];

	// Team Members (mock data)
	const teamMembers = [
		{
			name: 'Ilhom Nomozov',
			role: 'Founder & CEO',
			image: '/img/profile/magnus.png',
			bio: 'Computer Science Graduate, BUFS 2023',
		},
		{
			name: 'Elyor Ibrohimov',
			role: 'Lead Developer',
			image: '/img/profile/ray.jpg',
			bio: 'Software Engineering Student',
		},
		{
			name: 'James Bond',
			role: 'Community Manager',
			image: '/img/profile/JamesBond.jpeg',
			bio: 'Business Administration Major',
		},
		{
			name: 'David Kim',
			role: 'UX Designer',
			image: '/img/profile/david.jpeg',
			bio: 'Design & Media Arts Student',
		},
	];

	// Values Data
	const values = [
		{
			icon: <Shield size={32} />,
			title: 'Safety First',
			description: 'Verified student accounts and secure transactions ensure a safe community environment.',
		},
		{
			icon: <Heart size={32} />,
			title: 'Community Driven',
			description: 'Built by students, for students. Your feedback shapes our platform development.',
		},
		{
			icon: <Zap size={32} />,
			title: 'Innovation',
			description: 'Constantly evolving with new features to enhance your university experience.',
		},
	];

	if (device === 'mobile') {
		return <div>ABOUT PAGE MOBILE</div>;
	}

	return (
		<Stack className={'about-page'}>
			{/* Hero Section */}
			<Stack className={'hero-section'}>
				<Stack className={'container'}>
					<Box className={'hero-content'}>
						<Box className={'badge'}>
							<Zap size={16} />
							<span>About Cuben</span>
						</Box>
						<h1>Connecting University Students Through Innovation</h1>
						<p className={'subtitle'}>
							Cuben is more than just a platform – it's a vibrant community where students connect, collaborate, and
							thrive together. We're revolutionizing campus life by bringing everything students need into one seamless
							digital experience.
						</p>
						<Stack className={'hero-buttons'}>
							<Link href="/account/join" style={{ textDecoration: 'none' }}>
								<Button className={'primary-btn'}>
									Join Community
									<ArrowRight size={20} />
								</Button>
							</Link>
							<Link href="#contact" style={{ textDecoration: 'none' }}>
								<Button className={'secondary-btn'}>
									Contact Us
									<MessageCircle size={20} />
								</Button>
							</Link>
						</Stack>
					</Box>
				</Stack>
			</Stack>

			{/* Mission Section */}
			<Stack className={'mission-section'}>
				<Stack className={'container'}>
					<Stack className={'content-split'}>
						<Box className={'left'}>
							<Box className={'section-label'}>
								<Target size={20} />
								<span>Our Mission</span>
							</Box>
							<h2>Empowering Students to Build Meaningful Connections</h2>
						</Box>
						<Box className={'right'}>
							<p>
								At Busan University of Foreign Studies, we recognized that students needed a better way to connect,
								share, and support each other. Cuben was born from the idea that university life should be more than
								just attending classes – it's about building a community.
							</p>
							<p>
								Our platform brings together the best features of social networking, marketplace, and career
								development, all tailored specifically for university students. Whether you're looking for study
								partners, selling textbooks, or searching for your first internship, Cuben is here to help.
							</p>
							<Stack className={'mission-highlights'}>
								{values.map((value, index) => (
									<Box key={index} className={'highlight-item'}>
										<Box className={'icon-wrapper'}>{value.icon}</Box>
										<Box className={'text-content'}>
											<h4>{value.title}</h4>
											<p>{value.description}</p>
										</Box>
									</Box>
								))}
							</Stack>
						</Box>
					</Stack>
				</Stack>
			</Stack>

			{/* Statistics Section */}
			<Stack className={'statistics-section'}>
				<Stack className={'container'}>
					<Box className={'section-header'}>
						<h2>Growing Together</h2>
						<p>Our community continues to thrive with active student participation</p>
					</Box>
					<Stack className={'stats-grid'}>
						{statistics.map((stat, index) => (
							<Box key={index} className={'stat-card'} style={{ borderTopColor: stat.color }}>
								<Box className={'stat-icon'} style={{ background: `${stat.color}15`, color: stat.color }}>
									{stat.icon}
								</Box>
								<h3>{stat.number}</h3>
								<p>{stat.label}</p>
							</Box>
						))}
					</Stack>
				</Stack>
			</Stack>

			{/* Features Section */}
			<Stack className={'features-section'}>
				<Stack className={'container'}>
					<Box className={'section-header'}>
						<Box className={'section-label'}>
							<Star size={20} />
							<span>What We Offer</span>
						</Box>
						<h2>Everything You Need in One Place</h2>
						<p>Discover the features that make Cuben the ultimate platform for university students</p>
					</Box>
					<Stack className={'features-grid'}>
						{features.map((feature, index) => (
							<Box key={index} className={'feature-card'}>
								<Box className={'feature-icon'} style={{ background: `${feature.color}15`, color: feature.color }}>
									{feature.icon}
								</Box>
								<h3>{feature.title}</h3>
								<p>{feature.description}</p>
								<Button className={'learn-more-btn'} style={{ color: feature.color }}>
									Learn More <ArrowRight size={16} />
								</Button>
							</Box>
						))}
					</Stack>
				</Stack>
			</Stack>

			{/* Team Section */}
			<Stack className={'team-section'}>
				<Stack className={'container'}>
					<Box className={'section-header'}>
						<Box className={'section-label'}>
							<Users size={20} />
							<span>Our Team</span>
						</Box>
						<h2>Meet the People Behind Cuben</h2>
						<p>A passionate team of students building the future of campus connectivity</p>
					</Box>
					<Stack className={'team-grid'}>
						{teamMembers.map((member, index) => (
							<Box key={index} className={'team-card'}>
								<Box className={'member-image'}>
									<img src={member.image} alt={member.name} />
									<Box className={'member-overlay'}>
										<Button className={'contact-btn'}>
											<MessageCircle size={20} />
										</Button>
									</Box>
								</Box>
								<Box className={'member-info'}>
									<h3>{member.name}</h3>
									<span className={'role'}>{member.role}</span>
									<p className={'bio'}>{member.bio}</p>
								</Box>
							</Box>
						))}
					</Stack>
				</Stack>
			</Stack>

			{/* Vision Banner */}
			<Stack className={'vision-banner'}>
				<Stack className={'container'}>
					<Box className={'vision-content'}>
						<Award size={48} className={'vision-icon'} />
						<h2>Our Vision for the Future</h2>
						<p>
							We envision Cuben becoming the leading student community platform across universities in South Korea and
							beyond. By continuously innovating and listening to student needs, we're building a future where campus
							life is more connected, efficient, and enjoyable than ever before.
						</p>
					</Box>
				</Stack>
			</Stack>

			{/* University Info Section */}
			<Stack className={'university-section'}>
				<Stack className={'container'}>
					<Stack className={'content-split'}>
						<Box className={'left'}>
							<Box className={'university-image'}>
								<img src="/img/banner/bufscam.jpg" alt="BUFS Campus" />
							</Box>
						</Box>
						<Box className={'right'}>
							<Box className={'section-label'}>
								<BookOpen size={20} />
								<span>Our University</span>
							</Box>
							<h2>Busan University of Foreign Studies</h2>
							<p>
								Founded in 1981, BUFS has established itself as one of Korea's premier institutions for foreign
								language education and international studies. Our campus in Busan provides a vibrant, multicultural
								environment where students from diverse backgrounds come together to learn and grow.
							</p>
							<Stack className={'university-stats'}>
								<Box className={'stat-item'}>
									<TrendingUp size={24} />
									<Box>
										<strong>40+ Years</strong>
										<span>of Excellence</span>
									</Box>
								</Box>
								<Box className={'stat-item'}>
									<Users size={24} />
									<Box>
										<strong>8,000+</strong>
										<span>Students</span>
									</Box>
								</Box>
								<Box className={'stat-item'}>
									<Award size={24} />
									<Box>
										<strong>Top Ranked</strong>
										<span>in Foreign Languages</span>
									</Box>
								</Box>
							</Stack>
						</Box>
					</Stack>
				</Stack>
			</Stack>

			{/* CTA Section */}
			<Stack className={'cta-section'}>
				<Stack className={'container'}>
					<Box className={'cta-content'}>
						<h2>Ready to Join Our Community?</h2>
						<p>
							Connect with thousands of students, discover opportunities, and make the most of your university
							experience.
						</p>
						<Stack className={'cta-buttons'}>
							<Link href="/account/join" style={{ textDecoration: 'none' }}>
								<Button className={'cta-primary'}>
									Get Started Free
									<ArrowRight size={20} />
								</Button>
							</Link>
							<Link href="/help" style={{ textDecoration: 'none' }}>
								<Button className={'cta-secondary'}>Learn More</Button>
							</Link>
						</Stack>
					</Box>
				</Stack>
			</Stack>

			{/* Contact Section */}
			<Stack className={'contact-section'} id="contact">
				<Stack className={'container'}>
					<Stack className={'contact-grid'}>
						<Box className={'contact-info'}>
							<h2>Get in Touch</h2>
							<p>Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.</p>

							<Stack className={'contact-items'}>
								<Box className={'contact-item'}>
									<Box className={'contact-icon'}>
										<Mail size={24} />
									</Box>
									<Box>
										<strong>Email</strong>
										<span>inomozov@icloud.com</span>
									</Box>
								</Box>
								<Box className={'contact-item'}>
									<Box className={'contact-icon'}>
										<Phone size={24} />
									</Box>
									<Box>
										<strong>Phone</strong>
										<span>010-5165-7444</span>
									</Box>
								</Box>
								<Box className={'contact-item'}>
									<Box className={'contact-icon'}>
										<MapPin size={24} />
									</Box>
									<Box>
										<strong>Address</strong>
										<span>Busan University of Foreign Studies, Geumjeong-gu, Busan</span>
									</Box>
								</Box>
							</Stack>
						</Box>

						<Box className={'contact-form-wrapper'}>
							<Box className={'contact-form'}>
								<h3>Send us a Message</h3>
								<Stack className={'form-group'}>
									<input type="text" placeholder="Your Name" />
								</Stack>
								<Stack className={'form-group'}>
									<input type="email" placeholder="Your Email" />
								</Stack>
								<Stack className={'form-group'}>
									<input type="text" placeholder="Subject" />
								</Stack>
								<Stack className={'form-group'}>
									<textarea placeholder="Your Message" rows={5}></textarea>
								</Stack>
								<Button className={'submit-btn'}>
									Send Message
									<ArrowRight size={20} />
								</Button>
							</Box>
						</Box>
					</Stack>
				</Stack>
			</Stack>
		</Stack>
	);
};

export default withLayoutMain(About);