import React from 'react';
import { render } from 'react-dom';
import './index.less';
import SearchBox from './SearchBox';
import VersionSelector from './VersionSelector';
interface AppState {
    searchText: string;
}

class App extends React.Component<{}, AppState> {
    constructor(props: {}) {
        super(props);
        this.state = { searchText: '' };
    }

    public render() {
        return (
            <div>
                <SearchBox onSearch={this.onSearch} />
                <VersionSelector
                    packageName={this.state.searchText}
                    onVersionSelected={this.onVersionSelected}
                    fetchVersions={fetchVersions}
                />
            </div>
        );
    }

    private readonly onVersionSelected = (version: string) => {
        console.log(version);
    };

    private readonly onSearch = (text: string) => {
        this.setState({ searchText: text });
    };
}

async function fetchVersions(packageName: string) {
    const originalUri = `https://registry.npmjs.org/${encodeURIComponent(
        packageName
    )}`;
    const corsUri = `https://cors-anywhere.herokuapp.com/${originalUri}`;
    const response = await fetch(corsUri, {
        headers: {
            origin: window.location.protocol + '//' + window.location.host
        }
    });
    const json = await response.json();
    return Object.keys(json.versions);
}

render(<App />, document.getElementById('root'));
