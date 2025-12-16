import React, { SyntheticEvent, useState } from 'react';
import MuiAccordion, { AccordionProps } from '@mui/material/Accordion';
import { AccordionDetails, Box, Stack, Typography } from '@mui/material';
import MuiAccordionSummary, { AccordionSummaryProps } from '@mui/material/AccordionSummary';
import { styled } from '@mui/material/styles';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { ChevronDown } from 'lucide-react';

const Accordion = styled((props: AccordionProps) => <MuiAccordion disableGutters elevation={0} square {...props} />)(
	({ theme }) => ({
		border: `1px solid ${theme.palette.divider}`,
		borderRadius: '12px',
		marginBottom: '12px',
		'&:before': {
			display: 'none',
		},
	}),
);

const AccordionSummary = styled((props: AccordionSummaryProps) => (
	<MuiAccordionSummary expandIcon={<ChevronDown size={20} />} {...props} />
))(({ theme }) => ({
	backgroundColor: '#ffffff',
	borderRadius: '12px',
	'& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
		transform: 'rotate(180deg)',
	},
	'& .MuiAccordionSummary-content': {
		marginLeft: theme.spacing(1),
	},
}));

const Faq = () => {
	const device = useDeviceDetect();
	const [category, setCategory] = useState<string>('general');
	const [expanded, setExpanded] = useState<string | false>('panel1');

	const changeCategoryHandler = (cat: string) => {
		setCategory(cat);
	};

	const handleChange = (panel: string) => (event: SyntheticEvent, newExpanded: boolean) => {
		setExpanded(newExpanded ? panel : false);
	};

	const faqData: any = {
		general: [
			{
				id: 'gen1',
				question: 'What is Cuben?',
				answer:
					'Cuben is a university community platform designed specifically for Busan University of Foreign Studies students. It combines social networking, marketplace, job board, and event management all in one place.',
			},
			{
				id: 'gen2',
				question: 'Who can use Cuben?',
				answer:
					'Cuben is exclusively for BUFS students, faculty, and staff. You need a valid university email address to register and access the platform.',
			},
			{
				id: 'gen3',
				question: 'Is Cuben free to use?',
				answer:
					'Yes! Cuben is completely free for all BUFS community members. There are no hidden fees or premium subscriptions.',
			},
			{
				id: 'gen4',
				question: 'How do I create an account?',
				answer:
					'Click on "Login/Register" at the top right, fill in your details with your BUFS email address, and verify your account through the email we send you.',
			},
			{
				id: 'gen5',
				question: 'Can I use Cuben on mobile?',
				answer: 'Yes, Cuben is fully responsive and works great on mobile browsers. A dedicated mobile app is coming soon!',
			},
		],
		marketplace: [
			{
				id: 'mar1',
				question: 'How do I list an item for sale?',
				answer:
					'Go to your dashboard, click "Add Listing", fill in the product details, upload photos, set your price, and publish. Your listing will be live immediately.',
			},
			{
				id: 'mar2',
				question: 'Is it safe to buy and sell on Cuben?',
				answer:
					'We verify all users through university email addresses. However, always meet in public places on campus, check items before buying, and never share sensitive payment information.',
			},
			{
				id: 'mar3',
				question: 'What can I sell on Cuben Marketplace?',
				answer:
					'You can sell textbooks, electronics, furniture, clothes, and other student-friendly items. Prohibited items include illegal goods, weapons, and hazardous materials.',
			},
			{
				id: 'mar4',
				question: 'How do payments work?',
				answer:
					'Cuben facilitates connections between buyers and sellers. Payment arrangements are made directly between users. We recommend cash transactions on campus for safety.',
			},
			{
				id: 'mar5',
				question: 'Can I edit or delete my listing?',
				answer: 'Yes! Go to "My Listings" in your dashboard where you can edit, mark as sold, or delete any of your listings.',
			},
		],
		community: [
			{
				id: 'com1',
				question: 'What can I post in the community section?',
				answer:
					'Share study tips, campus life experiences, ask questions, find study partners, or discuss university-related topics. Keep it respectful and relevant to the BUFS community.',
			},
			{
				id: 'com2',
				question: 'What should I do if I see inappropriate content?',
				answer:
					'Click the three dots menu on any post and select "Report". Our moderation team will review it within 24 hours. Serious violations may result in account suspension.',
			},
			{
				id: 'com3',
				question: 'Can I delete or edit my posts?',
				answer:
					'Yes, you can edit or delete your own posts anytime. Click the three dots menu on your post and select the appropriate option.',
			},
			{
				id: 'com4',
				question: 'How do I follow other users?',
				answer: 'Visit any user\'s profile and click the "Follow" button. You\'ll see their posts in your "Following" feed.',
			},
			{
				id: 'com5',
				question: 'Are there community guidelines?',
				answer:
					'Yes! Be respectful, no hate speech, no spam, no impersonation, and keep content appropriate for an academic community. Full guidelines are available in the About page.',
			},
		],
		jobs: [
			{
				id: 'job1',
				question: 'What types of jobs are posted on Cuben?',
				answer:
					'Part-time jobs, internships, on-campus positions, tutoring opportunities, and entry-level positions suitable for students.',
			},
			{
				id: 'job2',
				question: 'How do I apply for a job?',
				answer:
					'Click on any job listing and hit the "Apply Now" button. You\'ll be directed to the application process specified by the employer.',
			},
			{
				id: 'job3',
				question: 'Can companies post job listings?',
				answer:
					'Yes, verified companies and university departments can post job opportunities. Contact our support team for verification.',
			},
			{
				id: 'job4',
				question: 'How do I know if a job posting is legitimate?',
				answer:
					'We verify all companies before allowing job posts. Look for the verified badge. If something seems suspicious, report it immediately.',
			},
			{
				id: 'job5',
				question: 'Can I save jobs to apply later?',
				answer: 'Yes! Click the bookmark icon on any job listing to save it. Access your saved jobs from your dashboard.',
			},
		],
		account: [
			{
				id: 'acc1',
				question: 'How do I change my password?',
				answer:
					'Go to Settings > Account Security > Change Password. Enter your current password and set a new one.',
			},
			{
				id: 'acc2',
				question: 'Can I change my profile information?',
				answer:
					'Yes! Go to your profile page and click "Edit Profile". You can update your name, bio, profile picture, and contact information.',
			},
			{
				id: 'acc3',
				question: 'How do I delete my account?',
				answer:
					'Go to Settings > Account Settings > Delete Account. Note: This action is permanent and cannot be undone.',
			},
			{
				id: 'acc4',
				question: 'I forgot my password. What should I do?',
				answer:
					'Click "Forgot Password" on the login page. Enter your email and we\'ll send you a password reset link.',
			},
			{
				id: 'acc5',
				question: 'How do I change my notification preferences?',
				answer: 'Go to Settings > Notifications and customize what notifications you want to receive and how.',
			},
		],
		technical: [
			{
				id: 'tech1',
				question: 'The website is loading slowly. What can I do?',
				answer:
					'Try clearing your browser cache, using a different browser, or checking your internet connection. If issues persist, contact support.',
			},
			{
				id: 'tech2',
				question: 'I can\'t upload images. What\'s wrong?',
				answer:
					'Make sure your images are under 5MB and in JPG, PNG, or WEBP format. Try compressing the image or using a different file.',
			},
			{
				id: 'tech3',
				question: 'Why can\'t I see my posts?',
				answer:
					'Posts may take a few seconds to appear. If they don\'t show up after refreshing, check if you\'re logged in and try again.',
			},
			{
				id: 'tech4',
				question: 'The chat feature isn\'t working',
				answer:
					'Ensure you\'re using the latest version of your browser. Clear cache and cookies, then try again. Contact support if the issue continues.',
			},
			{
				id: 'tech5',
				question: 'How do I report a bug?',
				answer: 'Go to Help Center > Contact Us and describe the bug in detail. Include screenshots if possible.',
			},
		],
	};

	const categories = [
		{ id: 'general', label: 'General', icon: '❓' },
		{ id: 'marketplace', label: 'Marketplace', icon: '🛒' },
		{ id: 'community', label: 'Community', icon: '👥' },
		{ id: 'jobs', label: 'Jobs', icon: '💼' },
		{ id: 'account', label: 'Account', icon: '👤' },
		{ id: 'technical', label: 'Technical', icon: '⚙️' },
	];

	if (device === 'mobile') {
		return <div>FAQ MOBILE</div>;
	}

	return (
		<Stack className={'faq-content'}>
			<Box className={'section-header'}>
				<h2>Frequently Asked Questions</h2>
				<p>Find answers to common questions about using Cuben</p>
			</Box>

			<Box className={'faq-categories'}>
				{categories.map((cat) => (
					<Box
						key={cat.id}
						className={`category-btn ${category === cat.id ? 'active' : ''}`}
						onClick={() => changeCategoryHandler(cat.id)}
					>
						<span className={'category-icon'}>{cat.icon}</span>
						<span className={'category-label'}>{cat.label}</span>
					</Box>
				))}
			</Box>

			<Stack className={'faq-list'}>
				{faqData[category] &&
					faqData[category].map((faq: any) => (
						<Accordion expanded={expanded === faq.id} onChange={handleChange(faq.id)} key={faq.id}>
							<AccordionSummary className="question-summary">
								<Box className={'question-badge'}>Q</Box>
								<Typography className={'question-text'}>{faq.question}</Typography>
							</AccordionSummary>
							<AccordionDetails className={'answer-details'}>
								<Stack className={'answer-content'}>
									<Box className={'answer-badge'}>A</Box>
									<Typography className={'answer-text'}>{faq.answer}</Typography>
								</Stack>
							</AccordionDetails>
						</Accordion>
					))}
			</Stack>
		</Stack>
	);
};

export default Faq;