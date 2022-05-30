import fetchStandardPageData from "@lib/page/fetchStandardPageData";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import React, { useEffect } from "react";
import { Layout } from "@components/core";
import { Grid, Typography } from "@mui/material";
import LookCard from "@components/cms-modern/Look/LookCard";
const ConstructorIOClient = require("@constructor-io/constructorio-client-javascript");

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const data = await fetchStandardPageData({ content: {} }, context)
  return {
    props: {
      ...data
    }
  }
}

interface FacetsProps {
  display_name: string;
  options: Array<any>;
}

export default function LookMainPage(
  { content }
    : InferGetServerSidePropsType<typeof getServerSideProps>) {

  const [looksList, setlooksList] = React.useState([] as Array<any>);
  const [looksNumber, setlooksNumber] = React.useState(0);
  const [viewedLooksList, setviewedLooksList] = React.useState([] as Array<any>);

  const [brandFacet, setbrandFacet] = React.useState({} as FacetsProps);
  const [colorFacet, setcolorFacet] = React.useState({} as FacetsProps);

  useEffect(() => {
    console.log("USE EFFECT");

    const constructorClient = new ConstructorIOClient({
      apiKey: 'key_qFJeU4DThqOqEtQt'
      // sessionId: 1234,
      // clientId: "1234"
    });
    
    constructorClient.search.getSearchResults('https://amplience.com/look', {
      section: "Looks",
      // filters: {
      //   color: "pink"
      // },
      // filters: {
      //   brand: "Ellos Collection"
      // },
      resultsPerPage: 50
    }).then((data: any) => {
      console.log("DATA", data);
      setlooksList(data.response.results);
      setlooksNumber(data.response.total_num_results);
      setbrandFacet(data.response.facets[0])
      setcolorFacet(data.response.facets[1])
    }).catch((e: any) => { console.log("ERROR", e) });

    constructorClient.recommendations.getRecommendations('looks_page', {
      section: "Looks",
      numResults: 5
    }).then((data: any) => {
      console.log("DATA", data);
      setviewedLooksList(data.response.results);
    }).catch((e: any) => { console.log("ERROR", e) });

  },[])

  return (
    <div className="af-main-content" style={{ paddingBottom: 60 }}>
      <Typography style={{ marginTop: 30, marginBottom: 20 }} variant="h2" component="h2">Shop Your Looks</Typography>
      <Typography style={{ marginTop: 30, marginBottom: 20 }} variant="body1" component="p">{looksNumber * 3} looks found for you</Typography>

      <Grid container>
        <Grid item md={2} xs={12}>
      <Typography variant="h3" component="h3">{brandFacet.display_name}</Typography>
      {
        brandFacet?.options?.map((item: any, i: number) => { 
          return <div key={i}>{`${item.display_name} (${item.count * 3})`}</div>
        })
      }
      
      <Typography variant="h3" component="h3" style={{paddingTop: 30}}>{colorFacet.display_name}</Typography>
      {
        colorFacet?.options?.map((item: any, i: number) => { 
          return <div key={i}>{`${item.display_name} (${item.count * 3})`}</div>
        })
      }
</Grid>
<Grid item md={10} xs={12}>
      <Grid container style={{display: "flex", justifyContent: "flex-start", flexWrap: "wrap", listStyle: "none", margin: 0, padding: 0 }}>
        {
          looksList.map((look: any, i: number) => { return <LookCard key={i} {...look.data} deliveryKey={look.data._meta.deliveryKey} deliveryId={look.data._meta.deliveryId}/> } )
        }
        {
          looksList.map((look: any, i: number) => { return <LookCard key={i} {...look.data} deliveryKey={look.data._meta.deliveryKey} deliveryId={look.data._meta.deliveryId}/> } )
        }
        {
          looksList.map((look: any, i: number) => { return <LookCard key={i} {...look.data} deliveryKey={look.data._meta.deliveryKey} deliveryId={look.data._meta.deliveryId}/> } )
        }
      </Grid>

      <Typography style={{ marginTop: 30, marginBottom: 20 }} variant="h2" component="h2">Recently Viewed Looks</Typography>
      <Grid container style={{display: "flex", justifyContent: "flex-start", flexWrap: "wrap", listStyle: "none", margin: 0, padding: 0 }}>
        {
          viewedLooksList.map((look: any, i: number) => { return <LookCard key={i} {...look.data} deliveryKey={look.data._meta.deliveryKey} deliveryId={look.data._meta.deliveryId}/> } )
        }
      </Grid>
      </Grid>
      </Grid>
    </div>
  );
}

LookMainPage.Layout = Layout;
