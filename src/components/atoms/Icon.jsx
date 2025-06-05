import * as Icons from 'lucide-react';

const Icon = ({ name, className = '', ...props }) => {
    const IconComponent = Icons[name] || Icons.HelpCircle;
    return <IconComponent className={className} {...props} />;
};

export default Icon;