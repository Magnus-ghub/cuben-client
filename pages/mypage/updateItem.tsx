import React from 'react';
import { NextPage } from 'next';
import UpdateItems from '../../libs/components/mypage/UpdateItems';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import withLayoutMain from '../../libs/components/layout/LayoutHome';

const UpdateItemPage: NextPage = () => {
	return <UpdateItems />;
};

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

export default withLayoutMain(UpdateItemPage);