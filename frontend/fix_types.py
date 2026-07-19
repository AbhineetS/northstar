import os
import sys

replacements = {
    "src/components/fan/__tests__/LineupWidget.test.tsx": ("<LineupWidget />", "<LineupWidget homeTeam='Team A' awayTeam='Team B' />"),
    "src/components/fan/__tests__/LogisticsWidget.test.tsx": ("<LogisticsWidget />", "<LogisticsWidget weather={{ temp: 20, condition: 'Sunny' }} route={{ duration: 15, mode: 'transit', status: 'optimal' }} />"),
    "src/components/fan/__tests__/StadiumMapWidget.test.tsx": ("<StadiumMapWidget />", "<StadiumMapWidget gate='A' section='100' seat='1' />"),
    "src/components/ui/__tests__/AnimatedNumber.test.tsx": ("<AnimatedNumber />", "<AnimatedNumber value={100} />"),
    "src/components/ui/__tests__/BentoGrid.test.tsx": ("<BentoGrid />", "<BentoGrid><div>Test</div></BentoGrid>"),
    "src/components/ui/__tests__/Dialog.test.tsx": ("<Dialog />", "<Dialog isOpen={true} onClose={() => {}}><div>Test</div></Dialog>"),
    "src/components/ui/__tests__/FootballHub.test.tsx": ("<FootballHub />", "<FootballHub isOpen={true} onClose={() => {}} activeMatchId='123' />"),
    "src/components/ui/__tests__/MagneticButton.test.tsx": ("<MagneticButton />", "<MagneticButton><div>Test</div></MagneticButton>"),
    "src/components/ui/__tests__/NotificationToaster.test.tsx": ("<NotificationToaster />", "<NotificationToaster profile='Fan' />"),
    "src/components/ui/__tests__/PageTransition.test.tsx": ("<PageTransition />", "<PageTransition><div>Test</div></PageTransition>"),
    "src/components/ui/__tests__/PremiumButton.test.tsx": ("expect(container.firstChild)", "expect(screen.getByText('Click Me'))"),
    "src/components/ui/__tests__/PremiumCard.test.tsx": ("<PremiumCard />", "<PremiumCard><div>Test</div></PremiumCard>"),
    "src/components/ui/__tests__/TiltCard.test.tsx": ("<TiltCard />", "<TiltCard><div>Test</div></TiltCard>")
}

def fix_type_errors():
    for filepath, (old_str, new_str) in replacements.items():
        if os.path.exists(filepath):
            with open(filepath, 'r') as f:
                content = f.read()
            
            # Special case for PremiumButton where we need to fix the screen import as well
            if filepath == "src/components/ui/__tests__/PremiumButton.test.tsx":
                if "import { render } from" in content:
                    content = content.replace("import { render } from", "import { render, screen } from")
                    
            content = content.replace(old_str, new_str)
            
            with open(filepath, 'w') as f:
                f.write(content)
                
if __name__ == "__main__":
    fix_type_errors()
