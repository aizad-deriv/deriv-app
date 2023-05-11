import React from 'react';
import WalletsImage from 'Assets/svgs/wallets';
import { WalletsIntroComponent } from '../wallets-intro';
import { render, screen } from '@testing-library/react';

describe('WalletsIntroComponent', () => {
    const image = <WalletsImage image='how_it_works' />;
    const title = 'Upgrade To Wallets';
    const description = 'Dont be broke';
    const bullets = ['Bullet 1', 'Bullet 2', 'Bullet 3'];

    it('should render', () => {
        const { container } = render(
            <WalletsIntroComponent image={image} title={title} description={description} bullets={bullets} />
        );
        expect(container).toBeInTheDocument();
    });

    it('should render icon', () => {
        render(<WalletsIntroComponent image={image} title={title} description={description} bullets={bullets} />);
        expect(screen.queryByTestId('dt_how_it_works')).toBeInTheDocument();
    });

    it('should render title, description and bullets', () => {
        render(<WalletsIntroComponent image={image} title={title} description={description} bullets={bullets} />);
        expect(screen.getByText(title)).toBeInTheDocument();
        expect(screen.getByText(description)).toBeInTheDocument();
        bullets.forEach(bullet => {
            expect(screen.getByText(bullet)).toBeInTheDocument();
        });
    });
});
