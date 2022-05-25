import fetchStandardPageData from "@lib/page/fetchStandardPageData";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import create404Error from '@lib/page/errors/create404Error';
import fetchContent, { GetByFilterRequest } from "@lib/cms/fetchContent";
import { createCmsContext, useCmsContext } from "@lib/cms/CmsContext";
import React, { useEffect } from "react";
import { Layout } from "@components/core";
import { Grid, Typography } from "@mui/material";
import LookCard from "@components/cms-modern/Look/LookCard";

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const cmsContext = await createCmsContext(context.req);

  const filterRequest: GetByFilterRequest = {
    filterBy: [{
      path: "/_meta/schema",
      value: "https://amplience.com/look"
    }]
  };

  const data = await fetchStandardPageData({ content: {} }, context)
  const looksData = await fetchContent([filterRequest], cmsContext)

  if (!looksData[0]) {
    return create404Error(looksData, context);
  }

  return {
    props: {
      ...data,
      looksData: looksData[0]
    }
  }
}

export default function LookMainPage(
  { looksData, content }
    : InferGetServerSidePropsType<typeof getServerSideProps>) {

  const [looksList, setlooksList] = React.useState(looksData as any);

  const cmsContext = useCmsContext();

  useEffect(() => {
    let filterRequest: GetByFilterRequest = {
      filterBy: [{
        path: "/_meta/schema",
        value: "https://amplience.com/look"
      }]
    };
    fetchContent([filterRequest], cmsContext).then(result => setlooksList(result[0]));
  }, [])

  return (
    <div className="af-main-content" style={{ paddingBottom: 60 }}>
      <Typography style={{ marginTop: 30, marginBottom: 20 }} variant="h2" component="h2">Shop the Looks</Typography>
      <pre>{looksList.length}</pre>
      <Grid container style={{ display: "flex", justifyContent: "flex-start", flexWrap: "wrap", listStyle: "none", margin: 0, padding: 0 }}>
        {
          looksList.responses.map((look: any, i: number) => <LookCard key={i} {...look.content} />)
        }
      </Grid>
    </div>
  );
}

LookMainPage.Layout = Layout;
