import React, { useCallback, useState } from 'react';
import { NavLink, Redirect, Route, RouteComponentProps, Switch } from 'react-router-dom';

import { AdminRouter } from '~/utils/router';
import { Button } from '~/view/components/button';
import { SendEmailModal } from '~/view/components/send-email-modal';

import { ConfirmModal } from './components/confirm-modal';
import { EmailInfoModal } from './components/email-info-modal';
import { ForwardMailModal } from './components/forward-modal';
import { Inbox } from './components/inbox';
import { SentMessages } from './components/sent-messages';
import { EmailSignature } from './components/signature';
import styles from './styles.scss';

export const MessagingPage: React.FC<RouteComponentProps> = () => {
  const [sendModalVisibility, setSendModalVisibility] = useState(false);

  const toggleSendModalVisibility = useCallback(() => {
    setSendModalVisibility(prevValue => !prevValue);
  }, []);

  return (
    <div className={styles['page']}>
      <div className={styles['page__title-wrapper']}>
        <h1 className={styles['page__title']}>Messaging</h1>
        <Button
          onClick={toggleSendModalVisibility}
          className={styles['page__send-btn']}
          title="Send email"
          variant="accent"
        />
      </div>
      <div className={styles['page__content']}>
        <div className={styles['page__menu']}>
          <NavLink
            to={AdminRouter.messaging.inboxMessages()}
            className={styles['page__menu-link']}
            activeClassName={styles['page__menu-link--active']}
          >
            Inbox
          </NavLink>
          <NavLink
            to={AdminRouter.messaging.sentMessages()}
            className={styles['page__menu-link']}
            activeClassName={styles['page__menu-link--active']}
          >
            Sent messages
          </NavLink>
          <NavLink
            to={AdminRouter.messaging.emailResponses()}
            className={styles['page__menu-link']}
            activeClassName={styles['page__menu-link--active']}
          >
            Email signature
          </NavLink>
        </div>
        <div className={styles['page__subpage']}>
          <Switch>
            <Route exact path={AdminRouter.messaging.inboxMessages()} component={Inbox} />
            <Route exact path={AdminRouter.messaging.sentMessages()} component={SentMessages} />
            <Route exact path={AdminRouter.messaging.emailResponses()} component={EmailSignature} />
            <Route path="*">
              <Redirect to={AdminRouter.messaging.inboxMessages()} />
            </Route>
          </Switch>
        </div>
      </div>
      <SendEmailModal visible={sendModalVisibility} onClose={toggleSendModalVisibility} />
      <EmailInfoModal />
      <ForwardMailModal />
      <ConfirmModal />
    </div>
  );
};
