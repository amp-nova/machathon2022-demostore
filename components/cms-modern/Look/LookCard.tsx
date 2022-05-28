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
      width: 220
    },
    content: {
        padding: 2,
        '&:last-child': { paddingBottom: 2 }
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

    deliveryKey: any;
}

const LookCard: React.FC<LookProps> = ({
  image,
  brand,
  title,
  description,
  deliveryKey,
  classes
}) => {
  return (
    <MuiCard className={classes.container} style={{
        boxShadow: "none", 
        display: "flex",
        flexDirection: "column",
        justifyContent: "left",
        textAlign: "left"
        }}>
      <CardContent className={classes.content}>
        {
          image && (
            <div className="amp-dc-image">
              <Link href={`/${deliveryKey}`}>
                <Image alt={title} image={image} />
              </Link>
            </div>
          )
        }
      </CardContent>
    </MuiCard>
  )
};

export default withStyles(styles)(LookCard);