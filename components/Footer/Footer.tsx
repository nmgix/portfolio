import styles from "./_footer.module.scss";
import React, { memo, useEffect, useState } from "react";
import Image from "next/image";
import { Button, InjectedProps, Input, TransitionStyles } from "nmgix-components/src";
import { Icon } from "components/Icon/Icon";
import { FormattedMessage, useIntl } from "react-intl";
import { JobTypes } from "types/Footer";
import { useAppContext } from "components/AppController/App.Controller";
import { createFooterEmailPopup } from "./FooterPopup/FooterPopup";
import { PopupCloseStatues } from "nmgix-components/src/components/PopupComponentsGroup/Popup/Popup";
import handleViewport from "react-in-viewport";
import { Transition } from "react-transition-group";
import { slideTransitionFunction } from "types/Transitions";

const ViewportFooter: React.FC<InjectedProps> = (props) => {
  const { inViewport } = props;

  const intl = useIntl();
  const context = useAppContext();

  const [email, setEmail] = useState<string>("");
  const updateEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    return setEmail(() => e.target.value.trim());
  };
  const [job, setJob] = useState<keyof typeof JobTypes>("mid");

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const onDestroy = (status: keyof typeof PopupCloseStatues) => {
      switch (status) {
        case "close": {
          return setTimeout(
            () =>
              context.alertsControl.current!.addAlert({
                children: <span>{intl.formatMessage({ id: "alerts.footer.captcha.refuse" })}</span>,
                scheme: "warning",
                type: "WindowFixed",
              }),
            0
          );
        }
        case "error": {
          return setTimeout(
            () =>
              context.alertsControl.current!.addAlert({
                children: <span>{intl.formatMessage({ id: "alerts.footer.error" })}</span>,
                scheme: "warning",
                type: "WindowFixed",
              }),
            0
          );
        }
        case "failure": {
          return setTimeout(
            () =>
              context.alertsControl.current!.addAlert({
                children: <span>{intl.formatMessage({ id: "alerts.footer.email.refuse" })}</span>,
                scheme: "warning",
                type: "WindowFixed",
              }),
            0
          );
        }
        case "success": {
          return setTimeout(
            () =>
              context.alertsControl.current!.addAlert({
                children: <span>{intl.formatMessage({ id: "alerts.footer.email.success" })}</span>,
                scheme: "success",
                type: "WindowFixed",
              }),
            0
          );
        }
      }
    };

    const emailRegexp = new RegExp(
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );

    if (email.trim().length === 0) {
      return context.alertsControl.current!.addAlert({
        children: <span>{intl.formatMessage({ id: "alerts.footer.email.miss" })}</span>,
        scheme: "warning",
        type: "WindowFixed",
      });
    } else if (!emailRegexp.test(email)) {
      return context.alertsControl.current!.addAlert({
        children: <span>{intl.formatMessage({ id: "alerts.footer.email.wrongformat" })}</span>,
        scheme: "warning",
        type: "WindowFixed",
      });
    } else {
      const { children } = createFooterEmailPopup(onDestroy, { email, job });
      context.popupsControl.current!.createPopup(children, onDestroy);
    }
  };

  const FormHeader: React.FC = () => (
    <div className={styles.contentHeader}>
      <h1>
        <FormattedMessage id='footer.title' />
      </h1>
      <span>
        <FormattedMessage id='footer.subtitile' />
      </span>
    </div>
  );

  const jobOptions = (
    <div className={styles.formBodyOptionsContent}>
      {Object.keys(JobTypes)
        .filter((el) => {
          return isNaN(Number(el));
        })
        .map((key) => (
          <Button
            buttonBorder={true}
            onClick={() => setJob(key as keyof typeof JobTypes)}
            opacity={job === key ? 1 : 0.5}
            size={"m"}
            color={"background-default"}
            key={key}
            backgroundColor={"background-alter"}>
            <FormattedMessage id={`footer.form.work.${key}`} />
          </Button>
        ))}
    </div>
  );

  const selectedJob = intl.formatMessage({ id: `footer.form.work.${job}` });
  const leftFormSection = (
    <div className={styles.formBodyOptions}>
      <span className={styles.formBodyNestedHeader}>
        <FormattedMessage id='footer.form.header.purpose' values={{ j: selectedJob }} />
      </span>
      {jobOptions}
    </div>
  );

  const inputSection = (
    <div className={styles.formBodyRequisitesContentControls} key={"emailwrapper"}>
      <Input placeholder='your-favorite@mail.domain' onChange={updateEmail} defaultValue={email} key='someemail' />
      <Button
        type='submit'
        buttonBorder={true}
        size={"m"}
        backgroundColor={"background-alter"}
        color={"background-default"}
        opacity={0.5}>
        <span>
          <FormattedMessage id='footer.form.send.button' />
        </span>
        <Icon icon='arrow-right' width={18} height={15} />
      </Button>
    </div>
  );

  const rightFormSection = (
    <div className={styles.formBodyRequisites}>
      <span className={styles.formBodyNestedHeader}>
        <FormattedMessage id='footer.form.header.email' />
      </span>
      <div className={styles.formBodyRequisitesContent}>
        {inputSection}
        <span>
          <FormattedMessage id='footer.form.send.warning' />
        </span>
      </div>
    </div>
  );

  const formContentSection = (
    <form onSubmit={onSubmit}>
      <div className={styles.formBody}>
        {leftFormSection}
        <div className={styles.formBodySeparator} />
        {rightFormSection}
      </div>
    </form>
  );
  const formWrapper = (
    <div className={styles.content}>
      <FormHeader />
      {formContentSection}
    </div>
  );

  const FooterSubtitleInformationSection: React.FC = memo(
    () => (
      <div className={styles.credentials}>
        <span>© 2020 - 2022</span>
        <Image priority src={"/icons/nmgix-logo.png"} width={37} height={22} draggable={false} alt={`nmgix's logo`} />
      </div>
    ),
    () => true
  );

  const [rendered, setRendered] = useState<boolean>(false);
  useEffect(() => {
    setRendered(true);
  }, [inViewport]);
  const slideTransition = slideTransitionFunction(200);

  return (
    <Transition timeout={500} in={rendered}>
      {(state) => (
        <footer className={styles.footer} style={{ ...slideTransition[state as keyof TransitionStyles] }}>
          {formWrapper}
          <FooterSubtitleInformationSection />
        </footer>
      )}
    </Transition>
  );
};

const Footer = handleViewport(ViewportFooter);

export default Footer;
