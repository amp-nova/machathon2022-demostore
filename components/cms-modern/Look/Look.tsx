import React, { useEffect } from "react";
import { Grid, CardContent, Typography, Card as MuiCard, Link } from '@mui/material';
import { CmsContent } from '@lib/cms/CmsContent';
import { withStyles, WithStyles } from '@mui/styles'
import { Theme } from '@mui/material';
import Image from "../Image";
import ReactMarkdown from 'markdown-to-jsx';
const ConstructorIOClient = require("@constructor-io/constructorio-client-javascript");

const styles = (theme: Theme) => ({
    root: {},
    container: {
        border: "none"
    },
    content: {
        padding: 10
    }
});

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


  useEffect(() => {
    console.log("USE EFFECT");

    const constructorClient = new ConstructorIOClient({
      apiKey: 'key_qFJeU4DThqOqEtQt'
      // sessionId: 1234,
      // clientId: "1234"
    });

    constructorClient.browse.getBrowseResults("collection_id", _meta.deliveryId, {
      resultsPerPage: 50
    }).then((data: any) => {
      console.log("DATA", data);
      setproductsList(data.response.results);
    }).catch((e: any) => { console.log("ERROR", e) });
  }, []);

  return (
    <Grid item xs={12} sm data-testid="Look" className={classes.root}>
      <MuiCard className={classes.container} style={{
          boxShadow: "none", 
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          textAlign: "left"
          }}>
        <CardContent className={classes.content}>
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
          {
            image && (
              <div className="amp-dc-image">
                <Image alt={title} image={image} query={'w=1280'}/>
              </div>
            )
          }
          <Typography variant="h2" component="h2" style={{ marginTop: 15, marginBottom: 15 }}>
            Shop the Look
          </Typography>
          <Grid container style={{ display: "flex", justifyContent: "flex-start", flexWrap: "wrap", listStyle: "none", margin: 0, padding: 0 }}>
          {
            productsList.map((item: any, i: number) => {
              return <div key={i} style={{width: 220, padding: 10}}>
                  <img alt={item.value} src={`${item.data.image_url}?w=220`} />
                </div>
            })
          }
          </Grid>
          {
            description && (
              <ReactMarkdown style={{paddingTop: 20}} options={options}>{description}</ReactMarkdown>
            )
          }
        </CardContent>
      </MuiCard>
    </Grid>
  )
};

export default withStyles(styles)(Look);