import React from 'react'
import { graphql } from 'gatsby'
import Img from 'gatsby-image'
import SEO from '../../components/seo/seo'
import DisqusComments from '../../components/disqus-comments/disqus-comments'
import Layout from '../../components/layout/layout'
import Pagination from '../../components/pagination/pagination'
import RelatedPosts from '../../components/related-posts/related-posts'
import style from './post.module.less'
import { ReactComponent as CalendarIcon } from '../../images/icons/calendar.svg'
import { ReactComponent as ClockIcon } from '../../images/icons/clock.svg'
import Utils from '../../utils/utils'
import Config from '../../../config'

import 'prism-themes/themes/prism-a11y-dark.css'
import 'prismjs/plugins/line-numbers/prism-line-numbers.css'
import './prism-override.scss'

export default ({ pageContext, data }) => {
  const { post, relatedPosts } = data
  const { html, timeToRead, frontmatter: meta } = post
  const { next, prev } = pageContext

  const { title, date, tags, category, image, slug, summary } = meta
  const img = image.childImageSharp.fluid
  const imgUrl = Utils.resolveUrl(Config.siteUrl, img.src)
  return (
    <Layout>
      <SEO
        title={title}
        description={summary}
        date={date}
        path={slug}
        next={next}
        prev={prev}
        contentType="article"
        imageUrl={imgUrl}
        keywords={tags}
        category={category}
      />
      <article className={style.post}>
        <div className={style.cover}>
          <Img fluid={img} title={summary} alt={title} />
        </div>
        <h1 className={style.post__title}>{meta.title}</h1>
        <div className={style.post__meta}>
          <time
            dateTime={date}
            aria-label={`Written on ${meta.longDate}`}
            className={style.post__metaItem}
          >
            <CalendarIcon className={style.post__metaIcon} aria-hidden="true" />
            {meta.shortDate}
          </time>
          <time
            aria-label={`Estimated reading time: ${timeToRead} minute${
              timeToRead !== 1 ? 's' : ''
            }`}
            dateTime={`P${timeToRead}M`}
            className={style.post__metaItem}
          >
            <ClockIcon className={style.post__metaIcon} aria-hidden="true" />
            {timeToRead} min read
          </time>
        </div>
        <div
          className={style.post__content}
          dangerouslySetInnerHTML={{ __html: html }}
        />
        <Pagination next={next} prev={prev} />
      </article>
      <RelatedPosts categoryLabel={pageContext.category} posts={relatedPosts} />
      <DisqusComments url={pageContext.canonical} />
    </Layout>
  )
}

export const query = graphql`
  query($slug: String!, $category: String) {
    post: markdownRemark(fields: { slug: { eq: $slug } }) {
      id
      html
      timeToRead
      frontmatter {
        title
        tags
        category
        summary
        slug
        date(formatString: "YYYY-MM-DD")
        shortDate: date(formatString: "MMM D, YYYY", locale: "en")
        longDate: date(formatString: "MMMM D, YYYY", locale: "en")
        summary
        image {
          publicURL
          childImageSharp {
            fluid(maxWidth: 1000) {
              ...GatsbyImageSharpFluid_tracedSVG
            }
          }
        }
      }
    }
    site {
      siteMetadata {
        siteUrl
      }
    }
    relatedPosts: allMarkdownRemark(
      filter: {
        frontmatter: { category: { eq: $category }, slug: { ne: $slug } }
      }
      sort: { fields: [frontmatter___date], order: [DESC] }
      limit: 4
    ) {
      edges {
        node {
          fields {
            slug
          }
          timeToRead
          frontmatter {
            title
            date(formatString: "MMM D, YYYY", locale: "en")
            image {
              childImageSharp {
                fixed(width: 350) {
                  ...GatsbyImageSharpFixed_withWebp
                }
              }
            }
          }
        }
      }
    }
  }
`
