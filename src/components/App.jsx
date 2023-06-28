import { Component } from 'react';
import { ContactForm } from './ContactForm/ContactForm';
import { ContactList } from './ContactList/ContactList';
import { Filter } from './Filter/Filter';
import { AppWrapper, TitleApp, TitleContacts } from './app.styled';
import { load, save } from 'utils/localStorage';

const initialState = [
  { id: 'id-1', name: 'Rosie Simpson', number: '459-12-56' },
  { id: 'id-2', name: 'Hermione Kline', number: '443-89-12' },
  { id: 'id-3', name: 'Eden Clements', number: '645-17-79' },
  { id: 'id-4', name: 'Annie Copeland', number: '227-91-26' },
];

export class App extends Component {
  state = {
    contacts: [],
    filter: '',
  };

  componentDidMount() {
    const data = load('contacts') ?? initialState;

    this.setState({ contacts: data });
  }

  componentDidUpdate(_, prevState) {
    const { contacts } = this.state;
    if (contacts !== prevState.contacts) {
      save('contacts', contacts);
    }
  }

  addContact = (name, number) => {
    const contact = {
      name,
      number,
      id: crypto.randomUUID(),
    };

    const isExist = this.state.contacts.find(
      elem => elem.name.toLowerCase() === name.toLowerCase()
    );
    if (isExist) {
      alert(`"${name}" is already in contacts!`);
      return;
    }

    this.setState(prevState => ({
      contacts: [...prevState.contacts, contact],
    }));
  };

  countTotalContacts = () => {
    return this.state.contacts.length;
  };

  onFilterChange = e => {
    this.setState({ filter: e.target.value });
  };

  getFilteredContact = () => {
    const { contacts, filter } = this.state;

    return contacts.filter(contact =>
      contact.name.toLowerCase().includes(filter.toLowerCase().trim())
    );
  };

  deleteContact = id => {
    this.setState(prevState => ({
      contacts: prevState.contacts.filter(contact => contact.id !== id),
    }));
  };

  render() {
    const filteredContacts = this.getFilteredContact();
    const total = this.countTotalContacts();

    return (
      <AppWrapper>
        <TitleApp>Phonebook</TitleApp>
        <ContactForm onSubmit={this.addContact} />
        <TitleContacts>Contacts</TitleContacts>

        {total === 0 ? (
          'There is no contacts in your phonebook!'
        ) : (
          <>
            <Filter filter={this.state.filter} onFilter={this.onFilterChange} />
            <ContactList
              contacts={filteredContacts}
              deleteContact={this.deleteContact}
            />
          </>
        )}
      </AppWrapper>
    );
  }
}
