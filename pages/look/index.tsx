import fetchStandardPageData from "@lib/page/fetchStandardPageData";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import create404Error from '@lib/page/errors/create404Error';
import fetchContent, { GetByFilterRequest } from "@lib/cms/fetchContent";
import { createCmsContext, useCmsContext } from "@lib/cms/CmsContext";
import { ConstructorIOClient } from "@constructor-io/constructorio-client-javascript";
import React, { useEffect } from "react";
import { Layout } from "@components/core";
import { Grid, Typography } from "@mui/material";
import LookCard from "@components/cms-modern/Look/LookCard";

export default function LookMainPage() {

  const [looksList, setlooksList] = React.useState([] as Array<any>);

  const constructorClient = new ConstructorIOClient({
    apiKey: 'key_qFJeU4DThqOqEtQt',
  });

  useEffect(() => {
    constructorClient.getSearchResults('', {
      section: "Looks",
    }).then(data => setlooksList(data.response.results));
  })

  return (
    <div className="af-main-content" style={{ paddingBottom: 60 }}>
      <Typography style={{ marginTop: 30, marginBottom: 20 }} variant="h2" component="h2">Shop the Looks</Typography>
      <pre>{looksList.length}</pre>
      <Grid container style={{ display: "flex", justifyContent: "flex-start", flexWrap: "wrap", listStyle: "none", margin: 0, padding: 0 }}>
        {
          looksList.map((look: any, i: number) => <LookCard key={i} {...look.content} />)
        }
      </Grid>
    </div>
  );
}

LookMainPage.Layout = Layout;
