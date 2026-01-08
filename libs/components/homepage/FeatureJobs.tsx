import React from 'react';
import { Stack, Box, Button, Chip, Skeleton } from '@mui/material';
import { useQuery } from '@apollo/client';
import Link from 'next/link';
import { Briefcase, MapPin, DollarSign } from 'lucide-react';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { GET_ARTICLES } from '../../apollo/user/query';
import { Article } from '../../types/article/article';
import { ArticleCategory } from '../../enums/article.enum';

const FeatureJobs = () => {
	const device = useDeviceDetect();

	const { loading, data, error } = useQuery(GET_ARTICLES, {
		variables: {
			input: {
				page: 1,
				limit: 2,
				sort: 'articleLikes',
				direction: 'DESC',
				search: { 
					articleCategory: ArticleCategory.CAREER 
				}, 
			},
		},
		fetchPolicy: 'cache-and-network',
	});

	// ✅ Date formatting function
	const formatPostedDate = (createdAt: string) => {
		const now = new Date();
		const posted = new Date(createdAt);
		const diffTime = Math.abs(now.getTime() - posted.getTime());
		const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
		
		if (diffDays === 0) return 'Today';
		if (diffDays === 1) return '1 day ago';
		if (diffDays < 30) return `${diffDays} days ago`;
		
		const diffMonths = Math.floor(diffDays / 30);
		if (diffMonths === 1) return '1 month ago';
		return `${diffMonths} months ago`;
	};

	const featuredJobs = data?.getArticles?.list?.map((article: Article) => ({
		id: article._id,
		title: article.articleTitle,
		company: article.memberData?.memberNick || 'Unknown Company',
		location: 'Remote', // ✅ Default qiymat
		salary: 'Negotiable', // ✅ Default qiymat
		type: 'Full-time', // ✅ Default qiymat
		logo: article.memberData?.memberImage 
			? `${process.env.REACT_APP_API_URL}/${article.memberData.memberImage}` 
			: '/img/default-logo.png', // ✅ To'g'rilandi
		posted: formatPostedDate(article.createdAt.toString()), // ✅ Format qo'llanildi
		likes: article.articleLikes || 0,
	})) || [];

	if (error) {
		console.error('Error fetching featured jobs:', error);
		return (
			<Stack className="jobs-section">
				<Box className="jobs-card error-state">
					<p>Unable to load jobs. Please try again later.</p>
				</Box>
			</Stack>
		);
	}

	if (device === 'mobile') {
		return (
			<Stack className="jobs-section">
				<div>Jobs Mobile</div>
			</Stack>
		);
	}

	if (loading) {
		return (
			<Stack className="jobs-section">
				<Box className="jobs-card">
					<Box className="card-header">
						<Briefcase size={20} className="header-icon" />
						<h3>Featured Jobs</h3>
						<Link href="/article?articleCategory=CAREER" className="view-all-link">
							View All
						</Link>
					</Box>
					<Stack className="jobs-list">
						{[1, 2].map((i) => (
							<Skeleton key={i} variant="rectangular" height={120} className="job-skeleton" />
						))}
					</Stack>
				</Box>
			</Stack>
		);
	}

	// ✅ Agar ma'lumot yo'q bo'lsa
	if (featuredJobs.length === 0) {
		return (
			<Stack className="jobs-section">
				<Box className="jobs-card">
					<Box className="card-header">
						<Briefcase size={20} className="header-icon" />
						<h3>Featured Jobs</h3>
					</Box>
					<Box className="empty-state">
						<p>No career opportunities available at the moment.</p>
						<Link href="/article?articleCategory=CAREER">
							<Button variant="outlined">Browse All Articles</Button>
						</Link>
					</Box>
				</Box>
			</Stack>
		);
	}

	return (
		<Stack className="jobs-section">
			<Box className="jobs-card">
				<Box className="card-header">
					<Briefcase size={20} className="header-icon" />
					<h3>Featured Jobs</h3>
					<Link href="/article?articleCategory=CAREER" className="view-all-link">
						View All
					</Link>
				</Box>
				<Stack className="jobs-list">
					{featuredJobs.map((job) => (
						<Link 
							key={job.id} 
							href={`/article?id=${job.id}`} // ✅ Tuzatildi: Query param ishlatildi (?id=...)
							style={{ textDecoration: 'none' }}
						>
							<Box className="job-item">
								<Box className="job-header">
									<img 
										src={job.logo} 
										alt={job.company} 
										className="company-logo"
										onError={(e) => {
											e.currentTarget.src = '/img/default-logo.png';
										}}
									/>
									<Chip label={job.type} size="small" className="job-type" />
								</Box>
								<h4>{job.title}</h4>
								<p className="company-name">{job.company}</p>
								<Box className="job-details">
									<span>
										<MapPin size={14} /> {job.location}
									</span>
									<span>
										<DollarSign size={14} /> {job.salary}
									</span>
								</Box>
								<Box className="job-footer">
									<span className="job-posted">{job.posted}</span> {/* ✅ Formatted date ko'rsatiladi */}
									<Button size="small" className="apply-btn">
										Apply Now
									</Button>
								</Box>
							</Box>
						</Link>
					))}
				</Stack>
			</Box>
		</Stack>
	);
};

export default FeatureJobs;