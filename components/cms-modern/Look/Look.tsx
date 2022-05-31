import React, { useEffect } from "react";
import { Grid, CardContent, Typography, Card as MuiCard, Link, Paper } from '@mui/material';
import { CmsContent } from '@lib/cms/CmsContent';
import { withStyles, WithStyles } from '@mui/styles'
import { Theme } from '@mui/material';
import Image from "../Image";
import ReactMarkdown from 'markdown-to-jsx';
import LookCard from "./LookCard";

const ConstructorIOClient = require("@constructor-io/constructorio-client-javascript");

const styles = (theme: Theme) => ({
    root: {},
    container: {
        border: "none"
    },
    content: {
        padding: 10
    },
    overlay: {
      zIndex: 100,
      background: "rgba(0, 0, 0, 0.0)",
      opacity: 0,
      transition: "0.5s",
      '&:hover': { transition: "0.5s", opacity: 1, background: "rgba(0, 0, 0, 0.5)" }
    }
});

function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const options = {
  overrides: {
    h1: { component: Typography, props: { variant: 'h1' } },
    h2: { component: Typography, props: { variant: 'h2' } },
    h3: { component: Typography, props: { variant: 'h3' } },
    h4: { component: Typography, props: { variant: 'h4', style: { marginTop: 20, marginBottom: 10 } } },
    h5: { component: Typography, props: { variant: 'h5' } },
    h6: { component: Typography, props: { variant: 'h6' } },
    p: { component: Typography, props: { variant: 'body1', style: { marginBottom: 10 } } },
    a: { component: Link },
    li: { component: ({ ...props }) => (
      <li>
        <Typography variant="body1" component="span" {...props} />
      </li>
    ) }
  }
};

export interface LookProps extends WithStyles<typeof styles> {
    className?: string;

    /**
     * Image Content Item
     */
    image?: CmsContent;

    /**
     * Title of the Look
     */
    title?: string;

    /**
     * Brand name
     */
    brand?: string;

    /**
     * Description
     */
    description?: string;

    /**
     * Main and related look products
     */
    products: any[];

    lookId?: string;

    _meta?: any;
}

const Look: React.FC<LookProps> = ({
  image,
  brand,
  title,
  lookId,
  _meta,
  description,
  products,
  classes
}) => {
  const [productsList, setproductsList] = React.useState([] as Array<any>);
  const [viewedLooksList, setviewedLooksList] = React.useState([] as Array<any>);
  const [recLooksList, setrecLooksList] = React.useState([] as Array<any>);

  useEffect(() => {
    console.log("USE EFFECT");

    const constructorClient = new ConstructorIOClient({
      apiKey: 'key_qFJeU4DThqOqEtQt'
      // sessionId: 1234,
      // clientId: "1234"
    });

    constructorClient.browse.getBrowseResults("collection_id", _meta.deliveryId, {
      numResults: 10
    }).then((data: any) => {
      console.log("DATA", data);
      setproductsList(data.response.results);

      const title = data?.response?.collection?.data?.title;
      const color = data?.response?.collection?.data?.color;
      const brand = data?.response?.collection?.data?.brand;

      let recs = [] as any[];
      if ( color ) {
        let searchFilter = `https://amplience.com/look ${color}`;
        constructorClient.search.getSearchResults(searchFilter, {
          section: "Looks",
          numResults: 6
        }).then((data: any) => {
          console.log("RECS COLOR", data);
          data.response.results.forEach((item: any) => {
              if ( item.data.title !== title ) recs.push(item);
          })
       })
      }
      if ( brand ) {
        let searchFilter = `https://amplience.com/look ${brand}`;
        constructorClient.search.getSearchResults(searchFilter, {
          section: "Looks",
          numResults: 6
        }).then((data: any) => {
          console.log("RECS BRAND", data);
          data.response.results.forEach((item: any) => {
            if ( item.data.title !== title ) recs.push(item);
          })
          // shuffle(recs);
          setrecLooksList(recs);
       })
      }
    }).catch((e: any) => { console.log("ERROR", e) });

    constructorClient.recommendations.getRecommendations('looks_page', {
      section: "Looks",
      numResults: 6
    }).then((data: any) => {
      console.log("DATA", data);
      setviewedLooksList(data.response.results);
    }).catch((e: any) => { console.log("ERROR", e) });
  }, [_meta.deliveryId]);

  return (
    <Grid container>
      <Grid item xs={12}>
      {
              brand && (
                <Typography variant="h3" component="h3" style={{ marginTop: 15, marginBottom: 15 }}>
                  {brand}
                </Typography>
              )
            }
            {
              title && (
                <Typography variant="h2" component="h2" style={{ marginTop: 15, marginBottom: 15 }}>
                  {title}
                </Typography>
              )
            }
      </Grid>
      <Grid item md={4} xs={12} sm data-testid="Look" className={classes.root} style={{padding: 10}}>
            {
              image && (
                <div className="amp-dc-image">
                  <Image alt={title} image={image} query={'fmt=jpg&bg=rgb(255,255,255)&w=1280'}/>
                </div>
              )
            }
          </Grid>
          <Grid item md={8} xs={12} style={{padding: 10}}>
            <Typography variant="h2" component="h2" style={{ marginTop: 15, marginBottom: 15 }}>
              Shop the Look
            </Typography>
            <Grid container style={{ display: "flex", justifyContent: "flex-start", flexWrap: "wrap", listStyle: "none", margin: 0, padding: 0 }}>
            {
              productsList.map((item: any, i: number) => {
                return <Grid md={2} xs={4} item key={i} style={{padding: 10}}>
                  <div className="amp-dc-image" style={{position: "relative"}}>
                    <div className={classes.overlay} style={{width: "100%", height: "100%", top: 0, left: 0, position: "absolute"}}>
                      <div style={{overflow: "hidden", width: 100, textAlign: "center", position: "absolute", top: "50%", left: "50%", transform: 'translateX(-50%) translateY(-50%)'}}>
                        <Typography noWrap style={{color: "#fff"}} component="p" variant="body1">{item.value}</Typography>
                      </div>
                    </div>
                    <img alt={item.value} width="100%" src={`${item.data.image_url}?fmt=jpg&bg=rgb(255,255,255)&w=250`} />
                  </div>
                  </Grid>
              })
            }
            </Grid>
            <Paper style={{padding: 30, backgroundColor: '#fafafa'}}>
              <Typography variant="h2" component="h2" style={{ marginTop: 15, marginBottom: 15 }}>
                Details
              </Typography>
            {
              description && (
                <ReactMarkdown style={{paddingTop: 20}} options={options}>{description}</ReactMarkdown>
              )
            }
            </Paper>
      </Grid>
      <Grid item xs={12}>

      <Typography style={{ marginTop: 30, marginBottom: 20 }} variant="h2" component="h2">Recommended Looks</Typography>
      <Grid container style={{display: "flex", justifyContent: "flex-start", flexWrap: "wrap", listStyle: "none", margin: 0, padding: 0 }}>
        {
          recLooksList.slice(0, 6).map((look: any, i: number) => { return <LookCard key={i} {...look.data} deliveryKey={look.data._meta.deliveryKey} deliveryId={look.data._meta.deliveryId}/> } )
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
  )
};

export default withStyles(styles)(Look);