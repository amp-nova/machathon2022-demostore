import fetchStandardPageData from "@lib/page/fetchStandardPageData";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import React, { useEffect } from "react";
import { Layout } from "@components/core";
import { Button, Grid, Input, Typography } from "@mui/material";
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

interface FilterProps {
  brand?: string;
  color?: string;
}

export default function LookMainPage(
  { content }
    : InferGetServerSidePropsType<typeof getServerSideProps>) {

  const [looksList, setlooksList] = React.useState([] as Array<any>);
  const [looksNumber, setlooksNumber] = React.useState(0);
  const [viewedLooksList, setviewedLooksList] = React.useState([] as Array<any>);

  const [brandFacet, setbrandFacet] = React.useState({} as FacetsProps);
  const [colorFacet, setcolorFacet] = React.useState({} as FacetsProps);
  const [selectedBrand, setselectedBrand] = React.useState("" || null);
  const [selectedColor, setselectedColor] = React.useState("" || null);

  const [search, setSearch] = React.useState('');
  const onChange = (event: any) => {
    setSearch(event.target.value);
  };

  useEffect(() => {
    const constructorClient = new ConstructorIOClient({
      apiKey: 'key_qFJeU4DThqOqEtQt'
    });

    /**
     * Building filters
     */
    const filters = {} as FilterProps;
    if (selectedBrand) {
      filters.brand = selectedBrand;
    }
    if (selectedColor) {
      filters.color = selectedColor;
    }

    let searchFilter = 'https://amplience.com/look';
    if (search.length > 2) searchFilter += " " + search;

    // Searching for looks
    constructorClient.search.getSearchResults(searchFilter, {
      section: "Looks",
      filters,
      resultsPerPage: 50
    }).then((data: any) => {
      setlooksList(data.response.results);
      setlooksNumber(data.response.total_num_results);
      data.response.facets.forEach((item: any) => {
        if (item.display_name === 'brand') {
          setbrandFacet(item)
        }
        if (item.display_name === 'color') {
          setcolorFacet(item)
        }
      })
    }).catch((e: any) => { console.log("ERROR", e) });

    // Getting previously viewed looks
    constructorClient.recommendations.getRecommendations('looks_page', {
      section: "Looks",
      numResults: 5
    }).then((data: any) => {
      console.log("DATA", data);
      setviewedLooksList(data.response.results);
    }).catch((e: any) => { console.log("ERROR", e) });

  }, [selectedBrand, selectedColor, search])

  return (
    <div className="af-main-content" style={{ paddingBottom: 60 }}>
      <Typography style={{ marginTop: 30, marginBottom: 20 }} variant="h2" component="h2">Shop Your Looks</Typography>
      <Typography style={{ marginTop: 30, marginBottom: 20 }} variant="body1" component="p">{looksNumber} looks found for you</Typography>

      <Grid container>
        <Grid item md={2} xs={12}>
          <div style={{ paddingBottom: 20 }}>
            <input value={search} onChange={onChange} />
          </div>
          {
            brandFacet &&
            <>
              <div>Selection: {selectedBrand} <Button style={{ backgroundColor: "#fff" }} onClick={(e: any) => { setselectedBrand(null) }}>x</Button></div>
              <Typography variant="h3" component="h3">{brandFacet?.display_name}</Typography>
              {
                brandFacet?.options?.map((item: any, i: number) => {
                  return <div key={i}><Button style={{ backgroundColor: "#fff" }} onClick={(e: any) => { setselectedBrand(item.display_name) }}>{`${item.display_name} (${item.count})`}</Button></div>
                })
              }
            </>
          }
          {
            colorFacet &&
            <><div style={{ paddingTop: 30 }}>Selection: {selectedColor} <Button style={{ backgroundColor: "#fff" }} onClick={(e: any) => { setselectedColor(null) }}>x</Button></div>
              <Typography variant="h3" component="h3">{colorFacet?.display_name}</Typography>
              {
                colorFacet?.options?.map((item: any, i: number) => {
                  return <div key={i}><Button style={{ backgroundColor: "#fff" }} onClick={(e: any) => { setselectedColor(item.display_name) }}>{`${item.display_name} (${item.count})`}</Button></div>
                })
              }
            </>
          }
        </Grid>
        <Grid item md={10} xs={12}>
          <Grid container style={{ display: "flex", justifyContent: "flex-start", flexWrap: "wrap", listStyle: "none", margin: 0, padding: 0 }}>
            {
              looksList.map((look: any, i: number) => { return <LookCard key={i} {...look.data} deliveryKey={look.data._meta.deliveryKey} deliveryId={look.data._meta.deliveryId} /> })
            }
          </Grid>

          <Typography style={{ marginTop: 30, marginBottom: 20 }} variant="h2" component="h2">Recently Viewed Looks</Typography>
          <Grid container style={{ display: "flex", justifyContent: "flex-start", flexWrap: "wrap", listStyle: "none", margin: 0, padding: 0 }}>
            {
              viewedLooksList.map((look: any, i: number) => { return <LookCard key={i} {...look.data} deliveryKey={look.data._meta.deliveryKey} deliveryId={look.data._meta.deliveryId} /> })
            }
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
}

LookMainPage.Layout = Layout;