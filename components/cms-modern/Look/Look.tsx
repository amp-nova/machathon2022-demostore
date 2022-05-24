import React from "react";
import { Grid, CardContent, Typography, Card as MuiCard, Link } from '@mui/material';
import { CmsContent } from '@lib/cms/CmsContent';
import { withStyles, WithStyles } from '@mui/styles'
import { Theme } from '@mui/material';
import Image from "../Image";
import ReactMarkdown from 'markdown-to-jsx';

const styles = (theme: Theme) => ({
    root: {},
    container: {
        border: "none"
    },
    content: {
        padding: 10
    },
    actions: { 
        justifyContent: "center",
        paddingBottom: 20
    },
    links: { 
        paddingLeft: 20,
        paddingRight: 20,
        color: "#fff",
        backgroundColor: "#000",
        borderRadius: 3,
        "&:hover": {
            backgroundColor: "#000" 
        }
    },
    linkText: {
        color: "#fff"
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
}

const Look: React.FC<LookProps> = ({
  image,
  brand,
  title,
  description,
  classes
}) => {
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
                <Image alt={title} image={image} />
              </div>
            )
          }
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