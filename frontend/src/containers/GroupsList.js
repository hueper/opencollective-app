import React, { Component } from 'react';
import { connect } from 'react-redux';
import { pushState } from 'redux-router';
import values from 'lodash/object/values';
import any from 'lodash/collection/any';

import fetchUserGroupsAndExpenses from '../actions/users/fetch_groups_and_expenses';
import fetchUserIfNeeded from '../actions/users/fetch_by_id_cached';
import getPreapprovalKeyForUser from '../actions/users/get_preapproval_key';
import confirmPreapprovalKey from '../actions/users/confirm_preapproval_key';
import fetchCards from '../actions/users/fetch_cards';
import fetchUser from '../actions/users/fetch_by_id';
import notify from '../actions/notification/notify';
import resetNotifications from '../actions/notification/reset';
import authorizeStripe from '../actions/users/authorize_stripe';

import Content from './Content';
import TopBar from '../components/TopBar';
import Group from '../components/Group';
import PaypalReminder from '../components/PaypalReminder';
import ProfileReminder from '../components/ProfileReminder';
import StripeReminder from '../components/StripeReminder';
import Notification from '../components/Notification';

import { nestExpensesInGroups } from '../lib/nest_items_in_groups';
import getUniqueValues from '../lib/get_unique_values';
import isHost from '../lib/is_host';

export class GroupsList extends Component {
  render() {
    const { users, groups, isLoading } = this.props;

    return (
      <div className='GroupsList'>
        <TopBar title='My collectives' hasBackButton={false} />
        <Content isLoading={isLoading}>
          <Notification {...this.props} />
          {reminder.call(this, this.props)}
          {groups.map(group => {
            return <Group {...group} users={users} key={group.id} />
          })}
        </Content>
      </div>
    );
  }

  componentDidMount() {
    const {
      fetchUserGroupsAndExpenses,
      userid,
      fetchUserIfNeeded,
      confirmPreapprovalKey,
      fetchCards,
      fetchUser,
      query,
      notify
    } = this.props;

    if (userid) {
      fetchUserGroupsAndExpenses(userid)
      .then(({expenses}) => getUniqueValues(expenses, 'UserId').map(fetchUserIfNeeded));

      fetchCards(userid, {
        service: 'paypal'
      });

      fetchUser(userid);
    }

    if (query.preapprovalKey && query.approvalStatus === 'success') {
      confirmPreapprovalKey(userid, query.preapprovalKey)
      .catch(error => notify('error', error.message));
    }
  }
}

export function reminder({
  getPreapprovalKeyForUser,
  inProgress,
  query,
  userid,
  showPaypalReminder,
  showProfileReminder,
  showStripeReminder,
  authorizeStripe,
  hasFinishedStripeAuth
}) {

  if (showStripeReminder) {
    return (
      <StripeReminder
        authorizeStripe={authorizeStripe}
        isSuccessful={hasFinishedStripeAuth} />
    );
  } else if (showPaypalReminder) {
    return (
      <PaypalReminder
        getPreapprovalKey={getPreapprovalKeyForUser.bind(this, userid)}
        inProgress={inProgress}
        approvalStatus={query.approvalStatus} />
    );
  } else if (showProfileReminder) {
    return (
      <ProfileReminder />
    );
  }
}

export default connect(mapStateToProps, {
  fetchUserGroupsAndExpenses,
  fetchUserIfNeeded,
  getPreapprovalKeyForUser,
  confirmPreapprovalKey,
  fetchCards,
  notify,
  fetchUser,
  resetNotifications,
  pushState,
  authorizeStripe
})(GroupsList);

export function mapStateToProps({users, session, router, notification}) {
  // Logged in user
  const userid = session.user.id;
  const currentUser = users[userid] || {};
  const { groups, expenses } = currentUser;
  const query = router.location.query;
  const userCards = values(currentUser.cards);
  const hasConfirmedCards = any(userCards, (c) => !!c.confirmedAt);
  const userIsHost = isHost(values(groups));
  const hasFinishedStripeAuth = query.stripeStatus === 'success';

  return {
    groups: nestExpensesInGroups(groups, expenses),
    userid,
    users,
    expenses,
    notification,
    inProgress: users.inProgress,
    query,
    isLoading: !groups,
    showPaypalReminder: userIsHost && (!hasConfirmedCards || query.preapprovalKey),
    showProfileReminder: !userIsHost && !currentUser.paypalEmail,
    userIsHost, // for testing
    hasConfirmedCards, // for testing
    showStripeReminder: userIsHost && (!currentUser.stripeAccount || hasFinishedStripeAuth),
    hasFinishedStripeAuth
  };
}
