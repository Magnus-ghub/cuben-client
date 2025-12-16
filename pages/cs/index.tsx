import React from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { Box, Stack } from '@mui/material';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import Notice from '../../libs/components/cs/Notice';
import Faq from '../../libs/components/cs/Faq';
import withLayoutMain from '../../libs/components/layout/LayoutHome';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { HelpCircle, Bell, MessageCircle, Mail, Phone, MapPin } from 'lucide-react';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const CS: NextPage = () => {
	const device = useDeviceDetect();
	const router = useRouter();

	/** HANDLERS **/
	const changeTabHandler = (tab: string) => {
		router.push(
			{
				pathname: '/cs',
				query: { tab: tab },
			},
			undefined,
			{ scroll: false },
		);
	};
	const tab = router.query.tab ?? 'notice';

	const contactMethods = [
		{
			icon: <Mail size={24} />,
			title: 'Email Support',
			value: 'support@cuben.kr',
			description: 'We typically respond within 24 hours',
		},
		{
			icon: <Phone size={24} />,
			title: 'Phone',
			value: '010-5165-7444',
			description: 'Mon-Fri, 9:00 AM - 6:00 PM KST',
		},
		{
			icon: <MapPin size={24} />,
			title: 'Campus Office',
			value: 'BUFS Student Center',
			description: 'Room 201, 2nd Floor',
		},
	];

	if (device === 'mobile') {
		return <h1>CS PAGE MOBILE</h1>;
	}

	return (
		<Stack className={'cs-page'}>
			<Stack className={'container'}>
				{/* Hero Section */}
				<Box className={'cs-hero'}>
					<Box className={'hero-icon'}>
						<HelpCircle size={48} />
					</Box>
					<h1>Help Center</h1>
					<p>Find answers to your questions and get support from our team</p>
				</Box>

				{/* Tab Navigation */}
				<Box className={'tab-navigation'}>
					<Box
						className={`tab-btn ${tab === 'notice' ? 'active' : ''}`}
						onClick={() => changeTabHandler('notice')}
					>
						<Bell size={20} />
						<span>Announcements</span>
					</Box>
					<Box className={`tab-btn ${tab === 'faq' ? 'active' : ''}`} onClick={() => changeTabHandler('faq')}>
						<HelpCircle size={20} />
						<span>FAQ</span>
					</Box>
					<Box
						className={`tab-btn ${tab === 'contact' ? 'active' : ''}`}
						onClick={() => changeTabHandler('contact')}
					>
						<MessageCircle size={20} />
						<span>Contact Us</span>
					</Box>
				</Box>

				{/* Content Area */}
				<Box className={'cs-content'}>
					{tab === 'notice' && <Notice />}
					{tab === 'faq' && <Faq />}
					{tab === 'contact' && (
						<Stack className={'contact-section'}>
							<Box className={'section-header'}>
								<h2>Get in Touch</h2>
								<p>Have a question? Our support team is here to help you</p>
							</Box>

							<Stack className={'contact-methods'}>
								{contactMethods.map((method, index) => (
									<Box key={index} className={'contact-card'}>
										<Box className={'contact-icon'}>{method.icon}</Box>
										<Box className={'contact-info'}>
											<h3>{method.title}</h3>
											<p className={'contact-value'}>{method.value}</p>
											<p className={'contact-description'}>{method.description}</p>
										</Box>
									</Box>
								))}
							</Stack>

							<Box className={'contact-form-wrapper'}>
								<h3>Send us a Message</h3>
								<p>Fill out the form below and we'll get back to you as soon as possible</p>

								<form className={'contact-form'}>
									<Box className={'form-row'}>
										<Box className={'form-group'}>
											<label>Name</label>
											<input type="text" placeholder="Your name" />
										</Box>
										<Box className={'form-group'}>
											<label>Email</label>
											<input type="email" placeholder="your.email@example.com" />
										</Box>
									</Box>

									<Box className={'form-group'}>
										<label>Subject</label>
										<input type="text" placeholder="What is this about?" />
									</Box>

									<Box className={'form-group'}>
										<label>Message</label>
										<textarea rows={6} placeholder="Describe your issue or question in detail..."></textarea>
									</Box>

									<Box className={'form-group'}>
										<label>Category</label>
										<select>
											<option>Select a category</option>
											<option>Account Issues</option>
											<option>Technical Support</option>
											<option>Marketplace</option>
											<option>Community Guidelines</option>
											<option>Job Board</option>
											<option>Other</option>
										</select>
									</Box>

									<button type="submit" className={'submit-btn'}>
										Send Message
									</button>
								</form>
							</Box>
						</Stack>
					)}
				</Box>
			</Stack>
		</Stack>
	);
};

export default withLayoutMain(CS);