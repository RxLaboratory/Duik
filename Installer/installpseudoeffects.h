#ifndef INSTALLPSEUDOEFFECTS_H
#define INSTALLPSEUDOEFFECTS_H

#include <QThread>
#include <QStringList>

class InstallPseudoEffects : public QThread
{
    Q_OBJECT
public:
    InstallPseudoEffects(QObject * parent = 0);
    void run();
    void setVersion(QStringList v);

signals:
    void log(QString);
    void finished(bool);

public slots:

private:
    bool updateDuik(QString scriptUIpath);
    bool updatePresetEffects(QString presetsFileName);
    QStringList version;
};

#endif // INSTALLPSEUDOEFFECTS_H
