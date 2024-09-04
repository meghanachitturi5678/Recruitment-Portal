import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';

import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import ArticleIcon from '@mui/icons-material/Article';
import MailIcon from '@mui/icons-material/Mail';
import TableChartIcon from '@mui/icons-material/TableChart';


export default function SideDrawer() {
    const menuItems = [
        {
            text: 'Dashboard',
            icon: <DashboardIcon />,
            path: '/dashboard'
        },
        {
            text: 'Applications',
            icon: <ArticleIcon />,
            path: '/applications'
        },
        {
            text: 'Positions',
            icon: <TableChartIcon />,
            path: '/positions'
        },
        {
            text: 'Employees',
            icon: <PeopleIcon />,
            path: '/employees'
        },
        {
            text: 'Templates',
            icon: <MailIcon />,
            path: '/templates'
        }
    ];
``
    const menu = () => (
        <Box
            sx={{ width: 250, marginTop: 10 }}
            role="presentation"
        >
            <List>
                {menuItems.map((item, index) => (
                    <ListItem key={item.text} disablePadding>
                        <ListItemButton LinkComponent={'a'} href={item.path}>
                            {item.icon}
                            <ListItemText  primary={item.text} sx={{marginLeft: "10px"}} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Box>
    );

    return (
        <div style={{ zIndex: 1 , position: 'fixed', top: 0, left: 0}}>
            <Drawer
                anchor="left"
                open={true}
                variant="persistent"
            >
                {menu()}
            </Drawer>
        </div >
    );
}
