import React, { useEffect, useState } from "react";
import { NewsletterDataTypes } from "../types";
import styles from "../_cell.module.scss";
import clsx from "clsx";
import Link from "next/link";
import Markdown from "markdown-to-jsx";

import dynamic from "next/dynamic";
import { randomIntFromInterval } from "helpers/randomNumber";
import { FormattedMessage } from "react-intl";
const ReactGitHubCalendar = dynamic(() => import("react-ts-github-calendar"), {
  ssr: false,
});

import { Transition } from "react-transition-group";
import handleViewport from "react-in-viewport";
import { InjectedProps, TransitionStyles } from "nmgix-components/src";
import { scaleTransition } from "types/Transitions";

const NewsletterDataComponent: React.FC<NewsletterDataTypes> = (cell) => {
  const { width, height } = cell.sizes[0];

  switch (cell.type) {
    case "bio": {
      return (
        <div className={clsx(styles.cellTypeBio)}>
          <h3>{cell.title}</h3>
          <Markdown>{cell.description}</Markdown>
        </div>
      );
    }
    case "courses": {
      const CoursesSection: React.FC = () => (
        <ul
          className={clsx(styles.cellTypeCoursesContent)}
          style={{
            display: "flex",
            flexDirection: "column",
          }}>
          {cell.courses.map((course) => (
            <li key={course.title} style={{ border: `4px solid ${cell.borderColor}` }}>
              <a href={course.link} referrerPolicy='no-referrer' target={"_blank"}>
                <div className={clsx(styles.courseMain)}>
                  <p>{course.title}</p>
                  <p>{course.teacher}</p>
                </div>
                <div className={clsx(styles.courseStats)}>
                  <span>
                    <b>
                      {course.mark.stars}/{course.mark.starsMax}
                    </b>
                  </span>
                  <span>
                    <b>{course.completePersantage}%</b>
                  </span>
                </div>
              </a>
            </li>
          ))}
        </ul>
      );

      return (
        <div className={clsx(styles.cellTypeCourses)}>
          <h3 dangerouslySetInnerHTML={{ __html: cell.title }} />
          <CoursesSection />
        </div>
      );
    }
    case "article": {
      const ArticleWrapper: React.FC<{ children: React.ReactNode; size: "2x1" | "2x2" }> = ({ children, size }) => (
        <div
          className={clsx(
            styles.cellTypeArticle,
            size === "2x1" ? styles.cellTypeArticle2x1 : styles.cellTypeArticle2x2
          )}
          style={{
            background: cell.backgroundColor
              ? cell.backgroundColor.length > 1
                ? `linear-gradient(${randomIntFromInterval(0, 360)}deg, ${cell.backgroundColor.join(",")})`
                : cell.backgroundColor[0]
              : undefined,
            color: cell.color ?? "rgba(var(--color-background-default), 1)",
          }}>
          {children}
        </div>
      );

      const ImageSection: React.FC = () =>
        cell.image ? <img src={cell.image} draggable={false} /> : <div className={clsx(styles.imagePlaceholder)}></div>;

      const TechStackSection: React.FC = () =>
        cell.techStack ? (
          <ul className={clsx(styles.articleTechstack)}>
            {cell.techStack.map((technology) => (
              <li key={technology}>
                <b>{technology}</b>
              </li>
            ))}
          </ul>
        ) : (
          <></>
        );

      if (width === 2 && height === 1) {
        return (
          <ArticleWrapper size='2x1'>
            <div className={clsx(styles.imageWrapper)}>
              <ImageSection />
            </div>
            <div className={clsx(styles.cellTypeArticleMain)}>
              <h3>
                <Link href={cell.url} locale={cell.locale} referrerPolicy='same-origin'>
                  {cell.title}
                </Link>
              </h3>
              <div className={clsx(styles.articleTime)}>
                <span>
                  {cell.ttr} <FormattedMessage id='article.subtitle.ttr' />
                </span>
                <span>{cell.date}</span>
              </div>
              <TechStackSection />
            </div>
          </ArticleWrapper>
        );
      } else {
        const TrunticatedDescription: React.FC = () =>
          cell.description && cell.description.toString().length > 90 ? (
            <div
              style={{
                position: "absolute",
                width: "100%",
                height: "50%",
                background: cell.backgroundColor
                  ? undefined
                  : `linear-gradient(180deg, #00000000, rgba(var(--color-background-alter), 1))`,
                bottom: 0,
              }}
            />
          ) : (
            <></>
          );

        const DescriptionSection: React.FC = () =>
          cell.description ? (
            <div style={{ position: "relative" }}>
              <p
                className={clsx(styles.articleDescription)}
                dangerouslySetInnerHTML={{
                  __html: `${cell.description.toString().slice(0, 90)}${
                    cell.description.toString().length > 90 ? "..." : ""
                  }`,
                }}
              />
              <TrunticatedDescription />
            </div>
          ) : (
            <></>
          );

        return (
          <ArticleWrapper size='2x2'>
            <div className={clsx(styles.imageWrapper)}>
              <ImageSection />
            </div>
            <h3>
              <Link href={cell.url} locale={cell.locale} referrerPolicy='same-origin'>
                {cell.title}
              </Link>
            </h3>
            <div className={clsx(styles.cellTypeArticleMain)}>
              <div className={clsx(styles.articleTime)}>
                <span>
                  {cell.ttr} <FormattedMessage id='article.subtitle.ttr' />
                </span>
                <span>{cell.date}</span>
              </div>
              <TechStackSection />
              <DescriptionSection />
            </div>
          </ArticleWrapper>
        );
      }
    }
  }
};

/**
 * Cell Component.
 * Component used to render data, basing on data type and size of a cell.
 * @param data data to render, includes basic information (id, size) and type-specific (description, images, e.t.c.).
 * @returns {React.FC<NewsletterDataTypes>} Functional Component
 */
export const ViewportCell: React.FC<NewsletterDataTypes & InjectedProps> = (cellData) => {
  const { id } = cellData;
  const { inViewport, enterCount } = cellData;

  const [rendered, setRendered] = useState<boolean>(false);
  useEffect(() => {
    setRendered(true);
  }, [inViewport]);

  return (
    <Transition timeout={100 * id} in={rendered && enterCount === 0}>
      {(state) =>
        rendered && (
          <li
            className={clsx(styles.cell, state)}
            style={{
              gridArea: `cell-${id}`,
              border: cellData.type === "courses" ? `3px solid ${cellData.borderColor}` : "",
              ...scaleTransition[state as keyof TransitionStyles],
            }}
            key={id}>
            <NewsletterDataComponent {...cellData} />
          </li>
        )
      }
    </Transition>
  );
};

export const Cell = handleViewport(ViewportCell /** options: {}, config: {} **/);
