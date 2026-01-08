import React from 'react';
import { Stack, Box, Button, Chip } from '@mui/material';
import Link from 'next/link';
import { Briefcase, MapPin, DollarSign } from 'lucide-react';
import useDeviceDetect from '../../hooks/useDeviceDetect';

const FeatureJobs = () => {
	const device = useDeviceDetect();

	// Mock Data - Keyinchalik API dan keladi
	const featuredJobs = [
		{
			id: 1,
			title: 'Frontend Developer Intern',
			company: 'Apple Company',
			location: 'Seoul, Korea',
			salary: '₩2,500,000/month',
			type: 'Internship',
			logo: '/img/logo/apple.gif',
			posted: '2 days ago',
		},
		{
			id: 2,
			title: 'Marketing Assistant',
			company: 'Naver Corporation',
			location: 'Busan, Korea',
			salary: '₩2,000,000/month',
			type: 'Part-time',
			logo: '/img/logo/naver.png',
			posted: '5 days ago',
		},
	];

	if (device === 'mobile') {
		return (
			<Stack className="jobs-section">
				<div>Jobs Mobile</div>
			</Stack>
		);
	}

	return (
		<Stack className="jobs-section">
			<Box className="jobs-card">
				<Box className="card-header">
					<Briefcase size={20} className="header-icon" />
					<h3>Featured Jobs</h3>
					<Link href="/article" className="view-all-link">
						View All
					</Link>
				</Box>
				<Stack className="jobs-list">
					{featuredJobs.map((job) => (
						<Link key={job.id} href={`/jobs/${job.id}`} style={{ textDecoration: 'none' }}>
							<Box className="job-item">
								<Box className="job-header">
									<img src={job.logo} alt={job.company} className="company-logo" />
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
									<span className="job-posted">{job.posted}</span>
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