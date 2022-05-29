import fetchStandardPageData from "@lib/page/fetchStandardPageData";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import create404Error from '@lib/page/errors/create404Error';
import fetchContent, { GetByFilterRequest } from "@lib/cms/fetchContent";
import { createCmsContext, useCmsContext } from "@lib/cms/CmsContext";
import React, { useEffect } from "react";
import { Layout } from "@components/core";
import { Grid, Typography } from "@mui/material";
import LookCard from "@components/cms-modern/Look/LookCard";
// import { ConstructorIOClient } from "@constructor-io/constructorio-client-javascript";
const ConstructorIOClient = require("@constructor-io/constructorio-client-javascript");

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

  const [looksList, setlooksList] = React.useState([] as Array<any>);

  const cmsContext = useCmsContext();

  const constructorClient = new ConstructorIOClient({
    apiKey: 'key_qFJeU4DThqOqEtQt',
    sessionId: 1234,
    clientId: "1234"
  });

  useEffect(() => {
    console.log("USE EFFECT");
    constructorClient.search.getSearchResults('https://amplience.com/look', {
      section: "Looks",
      resultsPerPage: 50
    }).then((data: any) => {
      console.log("DATA", data);
      setlooksList(data.response.results);
    }).catch((e: any) => { console.log("ERROR", e) });
  })

  return (
    <div className="af-main-content" style={{ paddingBottom: 60 }}>
      <Typography style={{ marginTop: 30, marginBottom: 20 }} variant="h2" component="h2">Shop the Look</Typography>
      <Grid container style={{ display: "flex", justifyContent: "flex-start", flexWrap: "wrap", listStyle: "none", margin: 0, padding: 0 }}>
        {
          looksList.map((look: any, i: number) => { return <LookCard key={i}  {...look.data} deliveryKey={look.data._meta.deliveryKey} /> } )
        }
      </Grid>
    </div>
  );
}

LookMainPage.Layout = Layout;
