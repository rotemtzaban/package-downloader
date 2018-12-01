import React from 'react';
import Select from 'react-select';
import semver from 'semver';
interface VersionSelectorProps {
    packageName: string;
    onVersionSelected: (version: string) => void;
    fetchVersions: (packageName: string) => Promise<string[]>;
}

interface VersionSelctorState {
    options?: string[];
    packageName?: string;
}

class VersionSelector extends React.Component<
    VersionSelectorProps,
    VersionSelctorState
> {
    constructor(props: VersionSelectorProps) {
        super(props);
        this.state = {};
    }
    public render() {
        const options = this.state.options || [];
        return (
            <Select
                isDisabled={
                    !this.props.packageName ||
                    this.props.packageName !== this.state.packageName
                }
                options={options
                    .filter(version => semver.valid(version) && !semver.prerelease(version))
                    .sort(semver.rcompare)
                    .map(option => {
                        return { value: option, label: option };
                    })}
            />
        );
    }

    public async componentDidUpdate() {
        if (
            !this.props.packageName ||
            this.props.packageName === this.state.packageName
        ) {
            return;
        }
        const versions = await this.props.fetchVersions(this.props.packageName);
        this.setState({
            options: versions,
            packageName: this.props.packageName
        });
    }
}

export default VersionSelector;
