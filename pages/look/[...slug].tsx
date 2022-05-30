import fetchStandardPageData from "@lib/page/fetchStandardPageData";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import create404Error from '@lib/page/errors/create404Error';
import React from "react";
import { ContentBlock } from "@components/cms-modern";
import { Layout } from "@components/core";
import { Typography } from "@mui/material";
import Link from "next/link";

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const {
    slug = []
  } = context.params || {};

  const [id] = slug;

  const [data] = await Promise.all(
    [
      fetchStandardPageData(
        {
          content: {
            look: {key: "look/" + id },
          },
        },
        context
      )
    ]
  );

  if (!data.content.look) {
    return create404Error(data, context);
  }

  return {
    props: {
      ...data
      }
    }
  }

export default function StorePage(
  {content}
: InferGetServerSidePropsType<typeof getServerSideProps>) {

  return (
    <div className="af-main-content" style={{paddingBottom: 60}}>
      <Typography variant="h3" component="h3" style={{paddingTop: 30}}>
        <Link href={'/look'}>
          &lt; Back to Your Looks
        </Link>
      </Typography>
      <ContentBlock content={content.look}></ContentBlock>
    </div>
  );
}

StorePage.Layout = Layout;