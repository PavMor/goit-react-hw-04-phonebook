import { Component } from 'react';
import { nanoid } from 'nanoid';
import { Report } from 'notiflix/build/notiflix-report-aio';
import { ContactForm } from './ContactForm/ContactForm';
import { ContactList } from './ContactList/ContactList';
import { Filter } from './Filter/Filter';
import { Message } from './Message/Message';
import { Container, Title, TitleСolor, Subtitle } from './App.styled';

export const App = class App extends Component {
  state = {
    contacts: [],
    filter: '',
  };

  addContact = ({ name, number }) => {
    const { contacts } = this.state;
    const newContact = { id: nanoid(), name, number };

    contacts.some(contact => contact.name.toLowerCase() === name.toLowerCase())
      ? Report.warning(
          `${name}`,
          'This user is already in the contact list.',
          'OK'
        )
      : this.setState(({ contacts }) => ({
          contacts: [newContact, ...contacts],
        }));
  };

  deleteContact = contactId => {
    this.setState(prevState => ({
      contacts: prevState.contacts.filter(contact => contact.id !== contactId),
    }));
  };

  changeFilter = e => {
    this.setState({ filter: e.currentTarget.value });
  };

  filteredContacts = () => {
    const { filter, contacts } = this.state;
    const normalizedFilter = filter.toLowerCase();
    return contacts.filter(({ name }) =>
      name.toLowerCase().includes(normalizedFilter)
    );
  };

  componentDidMount() {
    const contacts = localStorage.getItem("contacts");
    const parsedContacts = JSON.parse(contacts);

    if (parsedContacts) {
      this.setState({ contacts: parsedContacts });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.contacts !== prevState.contacts) {
      localStorage.setItem("contacts", JSON.stringify(this.state.contacts));
    }
  }

  render() {
    const { filter } = this.state;
    const addContact = this.addContact;
    const changeFilter = this.changeFilter;
    const filteredContacts = this.filteredContacts();
    const deleteContact = this.deleteContact;
    const length = this.state.contacts.length;

    return (
      <Container>
        <Title>
          Phone<TitleСolor>book</TitleСolor>
        </Title>
        <ContactForm onSubmit={addContact} />

        <Subtitle>Contacts</Subtitle>
        <Filter filter={filter} changeFilter={changeFilter} />
        {length > 0 ? (
          <ContactList
            contacts={filteredContacts}
            onDeleteContact={deleteContact}
          />
        ) : (
          <Message text="Contact list is empty." />
        )}
      </Container>
    );
  }
}