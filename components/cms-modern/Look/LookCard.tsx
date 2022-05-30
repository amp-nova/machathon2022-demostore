import React from "react";
import { CardContent, Typography, Card as MuiCard, Link } from '@mui/material';
import { CmsContent } from '@lib/cms/CmsContent';
import { withStyles, WithStyles } from '@mui/styles'
import { Theme } from '@mui/material';
import Image from "../Image";

const styles = (theme: Theme) => ({
    root: {},
    container: {
      width: 220
    },
    content: {
        padding: 2,
        '&:last-child': { paddingBottom: 2 }
    },
    overlay: {
      zIndex: 100,
      background: "rgba(0, 0, 0, 0.0)",
      opacity: 0,
      transition: "0.5s",
      '&:hover': { transition: "0.5s", opacity: 1, background: "rgba(0, 0, 0, 0.5)" }
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

    lookId?: string;

    deliveryKey: any;

    deliveryId: any;
}

const LookCard: React.FC<LookProps> = ({
  image,
  brand,
  title,
  lookId,
  description,
  deliveryKey,
  deliveryId,
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
            <Link href={`/${deliveryKey}/${deliveryId}`}>
              <div className="amp-dc-image" style={{position: "relative"}}>
                <div className={classes.overlay} style={{width: "100%", height: "100%", top: 0, left: 0, position: "absolute"}}>
                  <div style={{textAlign: "center", position: "absolute", top: "50%", left: "50%", transform: 'translateX(-50%) translateY(-50%)'}}>
                    <Typography style={{color: "#fff"}} component="h4" variant="h4">{brand}</Typography>
                    <Typography style={{color: "#fff"}} component="h5" variant="h5">{title}</Typography>
                  </div>
                </div>
                <Image alt={title} image={image} query={'w=220'} />
              </div>
            </Link>
          )
        }
      </CardContent>
    </MuiCard>
  )
};

export default withStyles(styles)(LookCard);